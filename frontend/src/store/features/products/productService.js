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

const productService = {
  createProduct,
};

export default productService;
