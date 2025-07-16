import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1/cart';

export const fetchCart = async () => {
  try {
    const res = await axios.get(`${API_URL}/`, { withCredentials: true });
    return res.data.cart;
  } catch (error) {
    console.error('Error fetching cart:', error.response?.data || error.message);
    throw error;
  }
};

export const addToCartAPI = async (productId, quantity) => {
  try {
    const res = await axios.post(`${API_URL}/add`, { productId, quantity }, { withCredentials: true });
    return res.data.cart;
  } catch (error) {
    console.error('Error adding to cart:', error.response?.data || error.message);
    throw error;
  }
};

export const removeFromCartAPI = async (productId) => {
  try {
    const res = await axios.post(`${API_URL}/remove`, { productId }, { withCredentials: true });
    return res.data.cart;
  } catch (error) {
    console.error('Error removing from cart:', error.response?.data || error.message);
    throw error;
  }
};

export const clearCartAPI = async () => {
  try {
    const res = await axios.post(`${API_URL}/clear`, {}, { withCredentials: true });
    return res.data;
  } catch (error) {
    console.error('Error clearing cart:', error.response?.data || error.message);
    throw error;
  }
}; 