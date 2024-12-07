import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCartByUser, deleteCartItem } from "./service";
import { USER_ID } from "./constants";

export const Cart = () => {
  const queryClient = useQueryClient();

  // Fetch cart data
  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart", USER_ID],
    queryFn: () => getCartByUser(USER_ID),
  });

  // Mutation for deleting a product from the cart
  const { mutate: deleteProduct, isLoading: isDeleting } = useMutation({
    mutationFn: deleteCartItem,
    onSuccess: () => {
      // Invalidate and refetch the cart data after successful deletion
      queryClient.invalidateQueries(["cart", USER_ID]);
    },
  });

  if (isLoading) return <p>Loading cart...</p>;
  if (isError) return <p>Something went wrong while fetching the cart!</p>;

  const handleDelete = (cartId) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      deleteProduct(cartId);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Your Cart</h1>
      {cart.map((item) => (
        <div key={item.id} className="card mb-4">
          <div className="card-header bg-dark text-white">
            <h5>
              Cart ID: {item.id} | Date:{" "}
              {new Date(item.date).toLocaleDateString()}
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
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(product.productId)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};
