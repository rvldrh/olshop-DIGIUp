import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getProducts } from './service';
import { Link } from 'react-router-dom';

export const Home = () => {
  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Something went wrong while fetching products!</p>;

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Our Products</h1>
      <div className="row g-3">
        {products.map((product) => (
          <div className="col-md-4 col-sm-6" key={product.id}>
            <div className="card h-100 shadow-sm">
              <div className="card-img-top-container" style={{ height: '200px', overflow: 'hidden' }}>
                <img
                  src={product.image}
                  alt={product.title}
                  className="card-img-top"
                  style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                />
              </div>
              <div className="card-body d-flex flex-column justify-content-between">
                <h5 className="card-title text-truncate">{product.title}</h5>
                <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
                <Link to={`/detail/${product.id}`} className="btn btn-primary mt-auto">
                  View Details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
