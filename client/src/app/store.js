import { configureStore } from '@reduxjs/toolkit'
import productReducer from '../features/products/products-slice'

export const store = configureStore({
  reducer: {
    products: productReducer
  },
})