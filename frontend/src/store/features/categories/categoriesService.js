import axios from "axios";

// use this function in store.js => createAsyncThunk

// Register

const createCat = async (inputValues) => {
  try {
    const axiosResponse = await axios.post(
      `http://localhost:8080/api/v1/categories`,
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
      `http://localhost:8080/api/v1/categories`,
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

const getSingleCat = async (slug) => {
  try {
    const axiosResponse = await axios.get(
      `http://localhost:8080/api/v1/categories/${slug}`,
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
// Update category
const updateCat = async ({name, slug}) => {
  try {
    const axiosResponse = await axios.put(
      `http://localhost:8080/api/v1/categories/${slug}`,
      {name},
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
      `http://localhost:8080/api/v1/categories/${slug}`,
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
const categoryService = { createCat, getAllCat, deleteCat,getSingleCat, updateCat };

export default categoryService;
