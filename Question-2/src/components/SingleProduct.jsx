import React from 'react';

const Product = ({ product }) => {
  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.category}</p>
        <p className="card-text">${product.price}</p>
      </div>
    </div>
  );
};

export default Product;
