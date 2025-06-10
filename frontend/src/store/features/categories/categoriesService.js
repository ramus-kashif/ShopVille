import axios from "axios";

// use this function in store.js => createAsyncThunk

// Register

const createCat = async (inputValues) => {
  try {
    const axiosResponse = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/categories`,
      inputValues,
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
// Getting all categories

const getAllCat = async () => {
  try {
    const axiosResponse = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/categories`,
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

//Delete category code
const deleteCat = async (slug) => {
  try {
    const axiosResponse = await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/categories/${slug}`,
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
const categoryService = { createCat, getAllCat, deleteCat };

export default categoryService;
