// userRoleSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    userRole: '',
    isLoading: false,
  };
  

const userRoleSlice = createSlice({
  name: 'userRoles',
  initialState,
  reducers: {
    assignUserRole: (state, action) => {
      const { userId, role } = action.payload;
      state.roles[userId] = role;
    },
  },
});

export const { assignUserRole } = userRoleSlice.actions;
export default userRoleSlice.reducer;
