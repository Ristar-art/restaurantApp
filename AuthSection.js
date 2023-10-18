import React, { useEffect ,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { setIsLoggedIn, setIsLoading } from './authSlice';
import { auth } from './firebaseConfig';
import { Text } from 'react-native';

function AuthSection() {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);
  const userRole = useSelector((state) => state.userRole);
  const [user, setUser] = useState(null); // Add a user state

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      dispatch(setIsLoggedIn(!!authUser));
      dispatch(setIsLoading(false));

      if (authUser) {
        // The user is authenticated; get user data
        setUser(authUser); // Store user data in the state
      } else {
        // No user is authenticated
        setUser(null); // Clear the user data
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // You can now access user information from the 'user' state
  if (user) {
    console.log('User data:', user);

    // Here, you can perform actions based on the user data.
    // For example, you can access user properties like email, displayName, etc.

    // Conditional rendering based on user role or other user data.
    // if (userRole === 'admin') {
    //   // Render admin content
    //   return <AdminContent />;
    // } else {
    //   // Render regular user content
    //   return <UserContent />;
    // }
  } else {
    // Render content for not logged in users
    return <Text>User not logged in.</Text>;
  }
}

export default AuthSection;
