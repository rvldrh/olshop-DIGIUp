import React from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCartByUser, deleteCartItem } from '../ApiService';
import { USER_ID } from './constants';

export const Cart = () => {
  const { data: cart, isLoading, isError } = useQuery(['cart', USER_ID], () => getCartByUser(USER_ID));
  const deleteMutation = useMutation(deleteCartItem);

  if (isLoading) return <p>Loading cart...</p>;
  if (isError) return <p>Something went wrong!</p>;

  return (
    <div className="container mt-4">
      <h1>Your Cart</h1>
      {cart.map((item) => (
        <div key={item.id} className="d-flex justify-content-between align-items-center mb-3">
          <div>{item.productId}</div>
          <button
            onClick={() => deleteMutation.mutate(item.id)}
            className="btn btn-danger"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};
