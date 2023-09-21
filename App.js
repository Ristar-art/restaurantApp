import React from 'react';
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
import AppNavigator from './components/AppNavigator';
import userRoleReducer from './components/userRoleSlice';
import ProfilePictureScreen from './components/Profile';
const Stack = createStackNavigator();

const store = configureStore({
  reducer: {
    auth: authReducer,
    customAuth: customAuthReducer,
    signUp: signUpSlice,
    userRoles: userRoleReducer
  }, 
});

export default function MainApp() {
  
  return (
     <Provider store={store}>
      <NavigationContainer>
      
        <Stack.Navigator>
           <Stack.Screen name="Home" component={Home} />
           <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }}/>
           <Stack.Screen name="Signup" component={SignUpForm} options={{ headerShown: false }}/>
           <Stack.Screen name="deshbord" component={DeshBord} options={{ headerShown: false }}/>
           <Stack.Screen name="RestaurantsDisplay" component={RestaurantsDisplay} options={{ headerShown: false }} />
           <Stack.Screen name="admin" component={AdminPanel} options={{ headerShown: false }}/>
           <Stack.Screen name="restaurantview" component={RestaurantView} options={{ headerShown: false }}/>
           <Stack.Screen name="table" component={TableScreen} options={{ headerShown: false }}/> 
           <Stack.Screen name="profile" component={ProfilePictureScreen} options={{ headerShown: false }}/>
           
        </Stack.Navigator>
       </NavigationContainer>
    </Provider>
    
  );
}
