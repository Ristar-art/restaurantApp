import { createSlice, configureStore } from '@reduxjs/toolkit';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  subscribe: true,
  loading: false,
  error:'',
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
    setSubscribe: (state, action) => {
      state.subscribe = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setSubscribe,
  setLoading,
  setError,
} = signUpSlice.actions;

export default signUpSlice.reducer;