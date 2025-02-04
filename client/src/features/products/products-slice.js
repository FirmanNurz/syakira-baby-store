import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  products: [], // Ganti items dengan products
  loading: false,
  error: "",
  search: "",
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    fetchPending(state) {
      state.loading = true;
      state.products = []; // Ganti items dengan products
      state.error = "";
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.products = action.payload; // Ganti items dengan products
      state.error = "";
    },
    fetchReject(state, action) {
      state.loading = false;
      state.products = []; // Ganti items dengan products
      state.error = action.payload;
    },
    setSearch(state, action) {
      state.search = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { fetchPending, fetchSuccess, fetchReject, setSearch } = productSlice.actions;

export const fetchProducts = () => async (dispatch) => {
  try {
    dispatch(fetchPending());

    const { data } = await axios.get("http://localhost:3000/products");

    dispatch(fetchSuccess(data.product));
  } catch (error) {
    dispatch(fetchReject(error.message));
  }
};

export default productSlice.reducer;