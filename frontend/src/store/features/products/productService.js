import axios from "axios";

// This function creates a new product by sending a POST request to the server
// Use this function in productSlice.js => createAsyncThunk

const createProduct = async (inputValues) => {
  try {
    const axiosResponse = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/products`,
      inputValues,
      {
        withCredentials: true, // Include credentials (cookies) in the request
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

const getAllProd = async () => {
  try {
    const axiosResponse = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/products`,
      {
        withCredentials: true, // axios send automatically cookies when we apply this property
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

const deleteProd = async (productId) => {
  try {
    const axiosResponse = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/products/${productId}`,
      {
        withCredentials: true, // axios send automatically cookies when we apply this property
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
const getSingleProd = async (productId) => {
  try {
    const axiosResponse = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/products/${productId}`,
      {
        withCredentials: true, // axios send automatically cookies when we apply this property
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

//Update single product

const updateProd = async (inputValues, productId) => {
  try {
    const axiosResponse = await axios.put(
      `${import.meta.env.VITE_BASE_URL}/products/${productId}`,
      inputValues,
      {
        withCredentials: true, // Include credentials (cookies) in the request
        headers: {
          "Content-Type": "multipart/form-data",
        },
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

const searchProducts = async ({ search = "", page = 1, limit = 8 }) => {
  try {
    const params = new URLSearchParams({ search, page, limit });
    const axiosResponse = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/products/search?${params.toString()}`,
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
  createProduct,
  getAllProd,
  deleteProd,
  getSingleProd,
  updateProd,
  searchProducts,
};

export default productService;
