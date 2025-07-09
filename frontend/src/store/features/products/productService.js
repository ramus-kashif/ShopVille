import axios from "axios";

// Get all products
const getAllProducts = async () => {
  try {
    const axiosResponse = await axios.get(
      `http://localhost:8080/api/v1/products`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong! Please try again";
    return Promise.reject(errorMessage);
  }
};

// Get single product
const getSingleProduct = async (productId) => {
  try {
    const axiosResponse = await axios.get(
      `http://localhost:8080/api/v1/products`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong! Please try again";
    return Promise.reject(errorMessage);
  }
};

// Get product by ID
const getProductById = async (productId) => {
  try {
    const axiosResponse = await axios.get(
      `http://localhost:8080/api/v1/products/${productId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong! Please try again";
    return Promise.reject(errorMessage);
  }
};

// Create product
const createProduct = async (productData) => {
  try {
    const axiosResponse = await axios.post(
      `http://localhost:8080/api/v1/products/${productId}`,
      productData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong! Please try again";
    return Promise.reject(errorMessage);
  }
};

// Update product
const updateProduct = async (productId, productData) => {
  try {
    const axiosResponse = await axios.put(
      `http://localhost:8080/api/v1/products/${productId}`,
      productData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong! Please try again";
    return Promise.reject(errorMessage);
  }
};

// Delete product
const deleteProduct = async (productId) => {
  try {
    const axiosResponse = await axios.delete(
      `http://localhost:8080/api/v1/products/${productId}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong! Please try again";
    return Promise.reject(errorMessage);
  }
};

// Search products
const searchProducts = async (searchParams) => {
  try {
    const params = new URLSearchParams();
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== undefined && searchParams[key] !== null && searchParams[key] !== '') {
        params.append(key, searchParams[key]);
      }
    });

    const axiosResponse = await axios.get(
      `http://localhost:8080/api/v1/products/search?${params.toString()}`,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    return axiosResponse.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong! Please try again";
    return Promise.reject(errorMessage);
  }
};

const productService = {
  getAllProducts,
  getSingleProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  searchProducts,
};

export default productService;
