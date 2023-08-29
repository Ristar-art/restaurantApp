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



const Stack = createStackNavigator();



const store = configureStore({
  reducer: {
    auth: authReducer,
    customAuth: customAuthReducer,
    signUp: signUpSlice
  },
});

export default function MainApp() {
  
  return (
     <Provider store={store}>
      <NavigationContainer>
      <Stack.Navigator>
  <Stack.Screen name="Home" component={Home} />
  <Stack.Screen name="Login" component={LoginPage} />
  <Stack.Screen name="Signup" component={SignUpForm} />

</Stack.Navigator>
       </NavigationContainer>
    </Provider>
    
  );
}
