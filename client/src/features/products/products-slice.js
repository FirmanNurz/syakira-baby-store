import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  items: [],
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
      state.items = [];
      state.error = "";
    },
    fetchSuccess(state, action) {
      state.loading = false;
      state.items = action.payload;
      state.error = "";
    },
    fetchReject(state, action) {
      state.loading = false;
      state.items = [];
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

    const { data } = await axios({
      method: "GET",
      url: 'https://firmanz.tech/products',
    });

    dispatch(fetchSuccess(data.product));
  } catch (error) {
    dispatch(fetchReject(error.message));
  }
};

export default productSlice.reducer;