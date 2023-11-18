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
  const [reservationData, setReservationData] = useState(null);

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

      const reservationsRef = doc(firestore, 'Reservations', currentUser.uid);

      getDoc(reservationsRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setReservationData(docSnapshot.data());
          }
        })
        .catch((error) => {
          console.error('Error fetching reservation data:', error);
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
      <View style={styles.cart}>
        {userData && (
          <View>
            <Text style={styles.buttonText}>Hi {userData.firstName}</Text>
            {/* <Text style={styles.buttonText}> {userData.email}</Text> */}
          </View>
        )}

        {reservationData && (
          <View>
           
            <Text style={styles.buttonText}> On {reservationData.date}</Text>
            <Text style={styles.label}> You made a reservation at: </Text>
            <Text style={styles.buttonText}> {reservationData.time}</Text>
            <Text style={styles.buttonText}> Can you confirm your Arrival</Text>
          </View>
        )}
      </View>

      <View style={styles.button}>
      <TouchableOpacity onPress={handleConfirmArrival}>
        <Text style={styles.btnText}>Confirm Arrival</Text>
      </TouchableOpacity>
        
      </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  StatusField: {
    height:60,
    backgroundColor:'green',
    width:'80%',
    borderRadius:10,
    padding:5,
    borderWidth: 1,
  },
  button: {
    width:290,
    height:60,
    backgroundColor: 'white',
    flexDirection:'row',
    borderRadius:10,
    padding:5,
    borderWidth: 5,
    alignItems:'center',
    borderWidth:1,
   
  }, 
  cart:{
    height:300,
    width:'61%',
    backgroundColor:'white',
    borderRadius:5,
    borderWidth:1
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    paddingTop:10,
    paddingBottom:20
  },
  btnText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
    
    
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default Status;
