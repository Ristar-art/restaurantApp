import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import {
  initializeAuth,
  getAuth,
  onAuthStateChanged,
  signOut,
} from 'firebase/auth';
import { setIsLoggedIn, setIsLoading } from '../authSlice';
import BackgroundImage from './BackgroundImage';

const firebaseConfig = {
  apiKey: 'AIzaSyC_u-KagLgoEhJv1sU0frmZc3Ro9kOBhFQ',
  authDomain: 'hoteldev-cc6fc.firebaseapp.com',
  projectId: 'hoteldev-cc6fc',
  storageBucket: 'hoteldev-cc6fc.appspot.com',
  messagingSenderId: '97226513206',
  appId: '1:97226513206:web:6f37147c02c1463024b197',
  measurementId: 'G-KHF96RZTK4',
};

const defaultApp = initializeApp(firebaseConfig);
const defaultStorage = getStorage(defaultApp); // Pass the app instance to getStorage
const defaultAuth = getAuth(defaultApp); // Pass the app instance to getAuth

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector(state => state.auth);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(defaultAuth, user => {
      dispatch(setIsLoggedIn(!!user));
      dispatch(setIsLoading(false));
    });

    signOut(defaultAuth);

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
  console.log('logged in?', isLoggedIn);

  return (
    <View style={styles.container}>
      
      <BackgroundImage />
      <View style={styles.content}>
        <View style={styles.card}>
        
          <Text style={styles.cardText}>kindom Resturant</Text>
         
        </View>
        <Button
          title="Go to Login Page"
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 5,
    top:1
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});
