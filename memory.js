import React,{useState,useEffect} from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Home from './components/home';
import LoginPage from './components/loginPage';
import customAuthReducer from './components/customAuthSilce';
import signUpSlice from './components/signUnSlice';
import SignUpForm from './components/SignUp'
import DeshBord from './components/Deshbord';
import RestaurantsDisplay from './components/RestaurantsDisplay'
import AdminPanel from './components/adminPanel';
import RestaurantView from './components/RestaurantView';
import TableScreen from './components/Table';
import userRoleReducer from './components/userRoleSlice';
import ProfilePictureScreen from './components/Profile';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Text, View, StyleSheet, Image } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Corrected import

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const store = configureStore({
  reducer: {
    auth: authReducer,
    customAuth: customAuthReducer,
    signUp: signUpSlice,
    userRoles: userRoleReducer
  }, 
});

const styles = StyleSheet.create({
  picture: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: '#f5f5f5', // Background color for the whole screen
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: 'blue'
  },
});

function CustomDrawerContent(props) {
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Fetch user data from Firestore when the component mounts
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const firestore = getFirestore();
      const userProfileRef = doc(firestore, 'Profile', user.uid);

      getDoc(userProfileRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  const hasProfileImage = userData.profileImage;

  return (
    <DrawerContentScrollView {...props}>
      {/* Your profile picture */}
      <View style={styles.picture}>
        {hasProfileImage ? (
          <Image source={{ uri: userData.profileImage }} style={styles.image} />
        ) : (
          <Text>No Profile Image</Text>
        )}
      </View>

      {/* Drawer items */}
      <DrawerItem
        label="Home"
        onPress={() => props.navigation.navigate('Home')}
      />
      <DrawerItem
        label="Profile"
        onPress={() => props.navigation.navigate('profile')} // Ensure 'profile' matches the screen name
      />
      <DrawerItem
        label="Admin"
        onPress={() => props.navigation.navigate('Admin')} 
      />
      {/* Add more DrawerItems for other navigation options as needed */}
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="profile" component={ProfilePictureScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Admin" component={AdminPanel} options={{ headerShown: false }} />
    </Drawer.Navigator>
  );
}

export default function MainApp() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="DrawerNavigator" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
          <Stack.Screen name="Login" component={LoginPage} />
          <Stack.Screen name="Signup" component={SignUpForm} />
          <Stack.Screen name="deshbord" component={DeshBord} />
          <Stack.Screen name="RestaurantsDisplay" component={RestaurantsDisplay} />
          <Stack.Screen name="restaurantview" component={RestaurantView} />
          <Stack.Screen name="table" component={TableScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
