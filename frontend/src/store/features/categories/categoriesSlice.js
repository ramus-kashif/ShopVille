import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import categoriesService from "./categoriesService.js";
// use this function in Categories
export const AddCategory = createAsyncThunk(
  "categories/AddCategory",
  async (inputValues, thunkAPI) => {
    try {
      const response = await categoriesService.createCat(inputValues);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// use this function in Categories
export const getAllCategories = createAsyncThunk(
  "categories/getAllCategories",
  async ( thunkAPI) => {
    try {
      const response = await categoriesService.getAllCat();
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// use this function in updateCategory
export const GetSingleCategory = createAsyncThunk(
  "categories/GetSingleCategory",
  async ( slug,thunkAPI) => {
    try {
      const response = await categoriesService.getSingleCat(slug);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
//use this function in updateCategory
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({name,slug }, thunkAPI) => {
    try {
      const response = await categoriesService.updateCat({name, slug});
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
// Delete category
export const DeleteCategory = createAsyncThunk(
  "categories/DeleteCategory",
  async (slug, thunkAPI) => {
    try {
      const response = await categoriesService.deleteCat(slug);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue(error);
    }
  }
);
const initialState = {
  categories: [],
  status: "idle",
  error: null,
  selectedCategory: "",
};
// use this in store file, categoriesReducer
export const categorieSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(AddCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(AddCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload.categories || [];
      })
      .addCase(AddCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(getAllCategories.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload.categories || [];
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(GetSingleCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(GetSingleCategory.fulfilled, (state, action) => {
        state.status = "success";
        state.categories = action.payload.category ? [action.payload.category] : [];
      })
      .addCase(GetSingleCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(updateCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.status = "success";
        // Refresh categories list after update
        // The actual categories will be fetched again when needed
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(DeleteCategory.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(DeleteCategory.fulfilled, (state, action) => {
        state.status = "success";
        // Refresh categories list after delete
        // The actual categories will be fetched again when needed
      })
      .addCase(DeleteCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

// Action creators are generated for each case reducer function
export const { setSelectedCategory } = categorieSlice.actions;

export default categorieSlice.reducer;
