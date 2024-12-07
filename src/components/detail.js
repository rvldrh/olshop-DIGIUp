import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getProductById, addToCart } from "./service";
import { USER_ID } from "./constants";

export const Detail = () => {
  const { id } = useParams(); // Get the product ID from the URL params
  const [quantity, setQuantity] = useState(1); // Set default quantity to 1

  // Correct useQuery usage in React Query v5 format
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ["product", id],
    queryFn: () => getProductById(id),
    onError: () => alert("Failed to fetch product details"),
  });

  const addToCartMutation = useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      alert("Product added to cart successfully!");
    },
    onError: () => {
      alert("Failed to add product to cart");
    },
  });

  if (isLoading) return <p>Loading product details...</p>;
  if (isError) return <p>Something went wrong while fetching the product details!</p>;

  const handleOrder = () => {
    if (quantity < 1) {
      alert("Quantity must be at least 1");
      return;
    }
    addToCartMutation.mutate({
      userId: USER_ID,
      products: [{ productId: parseInt(id), quantity }],
    });
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-lg-8 col-md-10 col-sm-12">
          <h1 className="text-center mb-4">{product.title}</h1>
          <img
            src={product.image}
            alt={product.title}
            className="img-fluid rounded mx-auto d-block mb-4"
            style={{ maxHeight: "400px", objectFit: "contain" }}
          />
          <p className="text-muted text-center">{product.description}</p>
          <p className="text-center">
            <strong>Price:</strong> ${product.price}
          </p>
          <div className="mb-3">
            <label htmlFor="quantity" className="form-label">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              value={quantity}
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="form-control"
              min="1"
            />
          </div>
          <div className="text-center">
            <button
              onClick={handleOrder}
              className="btn btn-success"
              disabled={addToCartMutation.isLoading}
            >
              {addToCartMutation.isLoading ? "Adding..." : "Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
