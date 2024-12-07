import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCartByUser, checkoutCart } from './service';
import { USER_ID } from './constants';

export const Checkout = () => {
  const queryClient = useQueryClient();

  // Fetch cart data for a specific user
  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['cart', USER_ID],
    queryFn: () => getCartByUser(USER_ID),
  });

  // Mutation for checking out the cart
  const { mutate: checkout, isLoading: isCheckingOut } = useMutation({
    mutationFn: checkoutCart,
    onSuccess: (data) => {
      // Handle success (e.g., show confirmation, navigate, etc.)
      alert('Checkout successful!');
      queryClient.invalidateQueries(['cart', USER_ID]); // Invalidate cart data
    },
    onError: () => {
      alert('Something went wrong during checkout.');
    },
  });

  if (isLoading) return <p>Loading cart...</p>;
  if (isError) return <p>Something went wrong while fetching the cart!</p>;

  const handleCheckout = () => {
    // Prepare checkout data (assuming we need cart items in the request body)
    const checkoutData = {
      userId: USER_ID,
      products: cart.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
      })),
    };

    // Call the checkout mutation with prepared data
    checkout(checkoutData);
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Your Checkout</h1>
      {cart.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        cart.map((item) => (
          <div key={item.id} className="card mb-4">
            <div className="card-header bg-dark text-white">
              <h5>
                Cart ID: {item.id} | Date: {new Date(item.date).toLocaleDateString()}
              </h5>
            </div>
            <div className="card-body">
              <h6>User ID: {item.userId}</h6>
              <h6>Products:</h6>
              <ul className="list-group">
                {item.products.map((product) => (
                  <li
                    key={product.productId}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    <span>Product ID: {product.productId}</span>
                    <span>Quantity: {product.quantity}</span>
                  </li>
                ))}
              </ul>
              <button
                className="btn btn-primary mt-3"
                onClick={handleCheckout}
                disabled={isCheckingOut}
              >
                {isCheckingOut ? 'Checking out...' : 'Checkout'}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};
