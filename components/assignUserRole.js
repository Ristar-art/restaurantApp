// userRoleSlice.js
import { updateDoc, doc, firestore } from 'firebase/firestore';

// Function to assign a role to a user
export const assignUserRole = (userId, role) => {
  const userRef = doc(firestore, 'users', userId);

  // Update the 'role' field in the user document
  return updateDoc(userRef, {
    role: role,
  });
};
