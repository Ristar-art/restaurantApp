import React,{useState,useEffect} from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
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
import { Text, View, StyleSheet, Image,Dimensions, SafeAreaView } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Corrected import
//import { auth, storage } from './firebaseConfig';
//import { setIsLoggedIn, setIsLoading } from './authSlice';
import AuthSection from './AuthSection';
import GlobalStyles from './GlobalStyles';
import ChooseTable from './components/ChooseTable';
import ConfirmBooking from './components/ConfirmBooking'
import Status from './components/Status';

import AddArestaurant from './components/AddArestaurant';
import ChooseAreaImage from './components/ChooseAreaImage';
import ManageRestaurant from './components/manageRestaurant';
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const windowWidth = Dimensions.get('window').width;

const store = configureStore({
  reducer: {
    auth: authReducer,
    customAuth: customAuthReducer,
    signUp: signUpSlice,
    userRoles: userRoleReducer,
  },
});



function CustomDrawerContent(props) {
  const [userData, setUserData] = useState({});
  const auth = getAuth();
  const user = auth.currentUser;
  const allowedEmail = "mochochokoboiketlo@gmail.com"; 

  useEffect(() => {
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
  }, [user]);
  const hasProfileImage = userData.profileImage;

  const canAccessAdminPanel = user && user.email === allowedEmail; 
  return (
  
    <DrawerContentScrollView {...props}>
      {/* Your profile picture */}
      <View style={styles.picture}>
        {hasProfileImage ? (
          <Image source={{ uri: userData.profileImage }} style={styles.image} />
        ) : (
          <Text></Text>
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
        label="Status"
        onPress={() => props.navigation.navigate('Status')} 
      />
      {canAccessAdminPanel && ( // Only show the Admin panel if the user's email matches the allowed email
        <DrawerItem
          label="Admin"
          onPress={() => props.navigation.navigate('Admin')} 
        />
      )}
      {/* Add more DrawerItems for other navigation options as needed */}
      <DrawerItem
          label="Admin"
          onPress={() => props.navigation.navigate('Admin')} 
        />
    </DrawerContentScrollView>
   
  );
}

function DrawerNavigator() {
  return (
   
  <SafeAreaView  style ={{ flex:1,backgroundColor: 'red' }}>

<Drawer.Navigator initialRouteName="Home" drawerContent={(props) => <CustomDrawerContent {...props} />} >          
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="profile" component={ProfilePictureScreen} options={{ headerShown: false }} />
      <Drawer.Screen name="Admin" component={AdminPanel} options={{ headerShown: false }} />
      <Drawer.Screen name="Status" component={Status} options={{ headerShown: false }} />     
    </Drawer.Navigator>  
   
  </SafeAreaView>
   
    
  );
}


export default function MainApp() {
  return (
    <Provider store={store}>
      
        <AuthSection/>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="DrawerNavigator" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="DrawerNavigator" component={DrawerNavigator} />
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="Signup" component={SignUpForm} />
            <Stack.Screen name="deshbord" component={DeshBord} />
            <Stack.Screen name="RestaurantsDisplay" component={RestaurantsDisplay} />
            <Stack.Screen name="restaurantview" component={RestaurantView} />
            <Stack.Screen name="table" component={TableScreen} />
            <Stack.Screen name="ChooseTable" component={ChooseTable} />
            <Stack.Screen name="ConfirmBooking" component={ConfirmBooking} />
            <Stack.Screen name="ManageRestaurant" component={ManageRestaurant} />
            <Stack.Screen name="AddArestaurant" component={AddArestaurant} />
            <Stack.Screen name="ChooseAreaImage" component={ChooseAreaImage} />

           </Stack.Navigator>
        </NavigationContainer>
      
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    //backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
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

