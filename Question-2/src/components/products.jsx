import React, { useEffect, useState } from 'react';
import FilterForm from './FilterForm';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [filters, setFilters] = useState({ name: '', category: '' });

  // Define the auth token
  const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MjE5MzE0LCJpYXQiOjE3MTcyMTkwMTQsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjYwMGM1ZDExLTllYTUtNGJkZS04YWNlLTRiZTk2NTc2NTc0ZiIsInN1YiI6InNhaGlsc2hvd2thdDY3NUBnbWFpbC5jb20ifSwiY29tcGFueU5hbWUiOiJhbHBoYWNvZGVycyIsImNsaWVudElEIjoiNjAwYzVkMTEtOWVhNS00YmRlLThhY2UtNGJlOTY1NzY1NzRmIiwiY2xpZW50U2VjcmV0IjoiZlBSeFJPSEhNZmdKVUJDdiIsIm93bmVyTmFtZSI6IlNhaGlsIiwib3duZXJFbWFpbCI6InNhaGlsc2hvd2thdDY3NUBnbWFpbC5jb20iLCJyb2xsTm8iOiIxMjYifQ.KRwQSFfwTJVMfdPi39z6fi44H_9rI4FXT8EhlRh6w0A";

  useEffect(() => {
    fetch('http://20.244.56.144/test/companies/AMZ/categories/Laptop/products?top=10&minPrice=1&maxPrice=10000', {
      headers: {
        'Authorization': `Bearer ${authToken}`
      }
    })
      .then(response => response.json())
      .then(data => {
        setProducts(data);
        setFilteredProducts(data);
        console.log(data);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [authToken]);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        (filters.name === '' || product.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (filters.category === '' || product.category.toLowerCase().includes(filters.category.toLowerCase()))
      )
    );
  }, [filters, products]);

  return (
    <div className="container">
      <h1 className="my-4">Products</h1>
      <FilterForm filters={filters} setFilters={setFilters} />
      <div className="row">
        {filteredProducts.map(product => (
          <div key={product.id} className="col-md-4 mb-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.category}</p>
                <p className="card-text">${product.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
