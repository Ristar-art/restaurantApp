import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const Status = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser; // Get the current user

    if (currentUser) {
      setUser(currentUser); // Set the user variable
      const firestore = getFirestore();
      const userProfileRef = doc(firestore, 'Profile', currentUser.uid);

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

  const handleConfirmArrival = async () => {
    try {
      const firestore = getFirestore();
      if (userData) {
        const reservationsRef = doc(firestore, 'Reservations', user.uid);
        await updateDoc(reservationsRef, { status: true });
        console.log('Status updated successfully.');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <View style={styles.container}>

{userData && (
        <View style={styles.StatusField}>
          <Text style={styles.buttonText}>{userData.firstName}</Text>
          <Text style={styles.buttonText}> {userData.email}</Text>          
        </View>
      )}
      <Text>Can you confirm your Arrival</Text>
      <TouchableOpacity onPress={handleConfirmArrival}>
        <Text>Confirm Arrival</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  StatusField: {
    height:60,
    backgroundColor:'green',
    width:'80%',
    borderRadius:10,
    padding:5,
    borderWidth: 1,
  }
});

export default Status;
