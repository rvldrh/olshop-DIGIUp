import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from './ApiService';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { data: products, isLoading, isError } = useQuery(['products'], getProducts);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong!</p>;

  return (
    <div className="container mt-4">
      <h1>Products</h1>
      <div className="row">
        {products.map((product) => (
          <div className="col-md-4 mb-4" key={product.id}>
            <div className="card h-100">
              <img src={product.image} className="card-img-top" alt={product.title} />
              <div className="card-body">
                <h5 className="card-title">{product.title}</h5>
                <p className="card-text">${product.price}</p>
                <Link to={`/detail/${product.id}`} className="btn btn-primary">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
