import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  isLoading: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setIsLoggedIn, setIsLoading } = authSlice.actions;
export default authSlice.reducer;
