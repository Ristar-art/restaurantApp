import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoggedIn: false,
  email: '',
  password: '',
  isLoading: false,
  error: null,
 
};

const customAuthSlice = createSlice({
  name: 'customAuth', 
  initialState,
  reducers: {
    setIsLoggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
    setEmail: (state, action) => {
        state.email = action.payload;
      },
      setPassword: (state, action) => {
        state.password = action.payload;
      },
      setLoading: (state, action) => {
        state.isLoading = action.payload;
      },
      setError: (state, action) => {
        state.error = action.payload;
      },
      clearError: (state) => {
        state.error = null;
      },
     
  },
});

export const { 
    setIsLoggedIn,
    setEmail,
    setPassword,
    setLoading,
    setError,
    clearError,
     } = customAuthSlice.actions;
export default customAuthSlice.reducer;
