import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, doc, updateDoc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const ConfirmBooking = ({ route }) => {
  const { restaurantId, restaurantName, documentID, collectionName, tableNumber, tableId, date, time } = route.params;
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  const formattedDate = new Date(date).toDateString();
  const formattedTime = time.toString();
  const db = getFirestore(); // Get the Firestore instance

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

  const handleConfirmBooking = async () => {
    try {
      if (userData && user) {
        const reservationsRef = doc(db, 'Reservations', user.uid);
        const reservationData = {
          userName: userData.firstName,
          userEmail: userData.email,
          restaurant: restaurantName,
          table: tableNumber,
          date: formattedDate,
          time: formattedTime,
          status: false,
        };
        await setDoc(reservationsRef, reservationData, { merge: true, timestamp: serverTimestamp() });
      }

      const docRef = doc(db, 'DATA', restaurantId, restaurantName, documentID, collectionName, tableId);
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        // The document exists, proceed with updates
        const fieldToUpdate = { available: false, date: date, time: time }; // Update the field with the new value

        // Update the document with the edited field
        await updateDoc(docRef, fieldToUpdate);

        console.log('Booking confirmed. Table availability updated.');
      } else {
        console.log('Document does not exist.');
      }
    } catch (error) {
      console.error('Error updating table availability: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Booking Details</Text>
      {userData && (
        <View>
          <Text style={styles.buttonText}> {userData.firstName}</Text>
          <Text style={styles.buttonText}>{userData.email}</Text>
        </View>
      )}
      <Text style={styles.buttonText}>Restaurant: {collectionName}</Text>
      <Text style={styles.buttonText}>Table: {tableNumber}</Text>
      <Text style={styles.buttonText}>Date: {formattedDate}</Text>
      <Text style={styles.buttonText}>Time: {formattedTime}</Text>

      <TouchableOpacity onPress={handleConfirmBooking} style={styles.confirmButton}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  confirmButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#90ffff',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default ConfirmBooking;
