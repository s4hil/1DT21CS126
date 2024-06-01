<?php

// Define constants
define('WINDOW_SIZE', 10);
define('THIRD_PARTY_API_URL', 'http://20.244.56.144/test/even');
define('TIMEOUT', 0.5);
define('AUTH_TOKEN', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MjE5MzE0LCJpYXQiOjE3MTcyMTkwMTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjYwMGM1ZDExLTllYTUtNGJkZS04YWNlLTRiZTk2NTc2NTc0ZiIsInN1YiI6InNhaGlsc2hvd2thdDY3NUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJhbHBoYWNvZGVycyIsImNsaWVudElEIjoiNjAwYzVkMTEtOWVhNS00YmRlLThhY2UtNGJlOTY1NzY1NzRmIiwiY2xpZW50U2VjcmV0IjoiZlBSeFJPSEhNZmdKVUJDviIsIm93bmVyTmFtZSI6IlNhaGlsIiwib3duZXJFbWFpbCI6InNhaGlsc2hvd2thdDY3NUBnbWFpbC5jb20iLCJyb2xsTm8iOiIxMjYifQ.KRwQSFfwTJVMfdPi39z6fi44H_9rI4FXT8EhlRh6w0A');

class AverageCalculator {
    private $numbersWindow = [];

    public function handleRequest($numberId) {
        if (!in_array($numberId, ['p', 'f', 'e', 'r'])) {
            $this->jsonResponse(['error' => 'Invalid number ID'], 400);
        }

        $prevWindowState = $this->numbersWindow;

        // Fetch numbers from third-party API
        $response = $this->fetchNumbers($numberId);

        if ($response['status'] !== 200) {
            $this->jsonResponse(['error' => 'Failed to fetch numbers'], 500);
        }

        $fetchedNumbers = $response['data']['numbers'];

        foreach ($fetchedNumbers as $num) {
            if (!in_array($num, $this->numbersWindow)) {
                $this->numbersWindow[] = $num;
                if (count($this->numbersWindow) > WINDOW_SIZE) {
                    array_shift($this->numbersWindow);
                }
            }
        }

        $currWindowState = $this->numbersWindow;
        $average = count($this->numbersWindow) > 0 ? array_sum($this->numbersWindow) / count($this->numbersWindow) : 0;

        $responseData = [
            'windowPrevState' => $prevWindowState,
            'windowCurrState' => $currWindowState,
            'numbers' => $fetchedNumbers,
            'avg' => round($average, 2)
        ];

        $this->jsonResponse($responseData, 200);
    }

    private function fetchNumbers($numberId) {
        $url = THIRD_PARTY_API_URL . '/' . $numberId;

        $options = [
            'http' => [
                'header' => "Authorization: Bearer " . AUTH_TOKEN,
                'timeout' => TIMEOUT
            ]
        ];

        $context = stream_context_create($options);
        $response = file_get_contents($url, false, $context);

        if ($response === false) {
            return ['status' => 500, 'data' => ['error' => 'Failed to fetch numbers']];
        }

        return ['status' => 200, 'data' => json_decode($response, true)];
    }

    private function jsonResponse($data, $statusCode) {
        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit();
    }
}

$calculator = new AverageCalculator();

if (isset($_GET['numberid'])) {
    $calculator->handleRequest($_GET['numberid']);
} else {
    echo json_encode(['error' => 'numberid parameter is required'], JSON_PRETTY_PRINT);
}
