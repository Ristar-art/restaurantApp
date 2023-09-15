// signUpSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  role: 'regularUser', // Add the 'role' field with the default value
  loading: false,
  error: null,
};

const signUpSlice = createSlice({
  name: 'signUp',
  initialState,
  reducers: {
    setFirstName: (state, action) => {
      state.firstName = action.payload;
    },
    setLastName: (state, action) => {
      state.lastName = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setRole: (state, action) => { // Add a new reducer for setting the 'role'
      state.role = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setRole, // Export the new reducer
  setLoading,
  setError,
} = signUpSlice.actions;

export default signUpSlice.reducer;
