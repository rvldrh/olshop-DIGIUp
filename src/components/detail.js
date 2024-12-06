import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getProductById, addToCart } from './ApiService';
import { USER_ID } from './constants';

export const Detail = () => {
  const { id } = useParams();
  const [quantity, setQuantity] = useState(1);
  const { data: product, isLoading, isError } = useQuery(['product', id], () => getProductById(id));
  const addToCartMutation = useMutation(addToCart);

  if (isLoading) return <p>Loading product details...</p>;
  if (isError) return <p>Something went wrong!</p>;

  const handleOrder = () => {
    addToCartMutation.mutate({
      userId: USER_ID,
      products: [{ productId: parseInt(id), quantity }],
    });
  };

  return (
    <div className="container mt-4">
      <h1>{product.title}</h1>
      <img src={product.image} alt={product.title} className="img-fluid mb-4" />
      <p>{product.description}</p>
      <p><strong>Price:</strong> ${product.price}</p>
      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        className="form-control mb-3"
        min="1"
      />
      <button onClick={handleOrder} className="btn btn-success">Order</button>
    </div>
  );
};
