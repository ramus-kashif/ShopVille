import axios from "axios";

// use this function in store.js => createAsyncThunk

// Register

const registerUser = async (inputValues) => {
  try {
    const axiosResponse = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/register`,
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

const loginUser = async (inputValues) => {
  try {
    const axiosResponse = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/users/login`,
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

const logoutUser = async () => {
  try {
    const axiosResponse = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/users/logout`,
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

const authService = { registerUser, loginUser, logoutUser };

export default authService;
