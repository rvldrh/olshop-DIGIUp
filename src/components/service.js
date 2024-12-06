import axios from 'axios';
import { API_URL } from './constants';

export const getProducts = async () => {
  const response = await axios.get(`${API_URL}/products`);
  return response.data;
};

export const getProductById = async (id) => {
  const response = await axios.get(`${API_URL}/products/${id}`);
  return response.data;
};

export const getCartByUser = async (userId) => {
  const response = await axios.get(`${API_URL}/carts/user/${userId}`);
  return response.data;
};

export const addToCart = async (cartData) => {
  const response = await axios.post(`${API_URL}/carts`, cartData);
  return response.data;
};

export const deleteCartItem = async (cartId) => {
  const response = await axios.delete(`${API_URL}/carts/${cartId}`);
  return response.data;
};
