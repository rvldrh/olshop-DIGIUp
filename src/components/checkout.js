import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getCartByUser } from './ApiService';
import { USER_ID } from './constants';

export const Checkout = () => {
  const { data: cart, isLoading, isError } = useQuery(['checkout', USER_ID], () => getCartByUser(USER_ID));

  if (isLoading) return <p>Loading checkout details...</p>;
  if (isError) return <p>Something went wrong!</p>;

  return (
    <div className="container mt-4">
      <h1>Checkout</h1>
      {cart.map((item) => (
        <p key={item.id}>Product ID: {item.productId}, Quantity: {item.quantity}</p>
      ))}
    </div>
  );
};
