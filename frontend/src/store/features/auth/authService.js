import axios from "axios";

// use this function in store.js => createAsyncThunk

// Register
const register = async (inputValues) => {
  try {
    const axiosResponse = await axios.post(
      `http://localhost:8080/api/v1/users/register`,
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

// Login
const login = async (inputValues) => {
  try {
    const axiosResponse = await axios.post(
      `http://localhost:8080/api/v1/users/login`,
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

// Logout
const logout = async () => {
  try {
    const axiosResponse = await axios.post(
      `http://localhost:8080/api/v1/users/logout`,
      {},
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

const authService = { register, login, logout };

export default authService;
