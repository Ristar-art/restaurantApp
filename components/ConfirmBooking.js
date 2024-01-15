import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import {
  getFirestore,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

const ConfirmBooking = ({ route }) => {
  const {
    restaurantId,
    restaurantName,
    documentID,
    collectionName,
    tableNumber,
    tableId,
    date,
    time,
  } = route.params;
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
      const userProfileRef = doc(firestore, "Profile", currentUser.uid);

      getDoc(userProfileRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
          }
        })

        .catch((error) => {
          console.error("Error fetching user data:", error);
        });
    }
  }, []);

  const handleConfirmBooking = async () => {
    try {
      if (userData && user) {
        const reservationsRef = doc(db, "Reservations", user.uid);

        const reservationData = {
          userName: userData.firstName,
          userEmail: userData.email,
          restaurant: restaurantName,
          table: tableNumber,
          date: formattedDate,
          time: formattedTime,
          status: false,
        };
        await setDoc(reservationsRef, reservationData, {
          merge: true,
          timestamp: serverTimestamp(),
        });
      }

      const docRef = doc(
        db,
        "DATA",
        restaurantId,
        restaurantName,
        documentID,
        collectionName,
        tableId
      );
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        // The document exists, proceed with updates
        const fieldToUpdate = { available: false, date: date, time: time }; // Update the field with the new value

        // Update the document with the edited field
        await updateDoc(docRef, fieldToUpdate);

        console.log("Booking confirmed. Table availability updated.");
      } else {
        console.log("Document does not exist.");
      }
    } catch (error) {
      console.error("Error updating table availability: ", error);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          marginBottom: 20,
          color: "black",
        }}
      >
        Booking Details
      </Text>
      <View
        style={{
          height: 200,
          width: "90%",
          // backgroundColor: "white",
          borderRadius: 5,
          borderWidth: 1,
          borderColor: "black",
          border: 10,
        }}
      >
        <View
          style={{
            height: 100,
            width: "100%",
            //backgroundColor: "gray",
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
        >
          {userData && (
            <View
              style={{
               // backgroundColor: "gray",
                //paddingVertical: 110,
               // paddingHorizontal: 15,
               // borderBottomLeftRadius: 5,
              //  borderBottomRightRadius: 5,
              }}
            >
              <Text style={styles.buttonText1}> Hi {userData.firstName}</Text>
              <Text style={styles.buttonText1}> You have made a booking at:</Text>
            </View>
          )}
        </View>

        <Text style={styles.buttonText}> {collectionName}</Text>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.buttonText}>Table:</Text>
          <Text style={styles.buttonText}> {tableNumber}</Text>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.buttonText}>Date:</Text>
          <Text style={styles.buttonText}> {formattedDate}</Text>
        </View>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            paddingHorizontal: 10,
          }}
        >
          <Text style={styles.buttonText}>Time:</Text>
          <Text style={styles.buttonText}> Time: {formattedTime}</Text>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleConfirmBooking}
        style={styles.confirmButton}
      >
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>

      {userData && (
        <View>
          <Text style={styles.buttonText}>{userData.email}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    //  backgroundColor: "white",
  },
  header: {},
  userDetails: {
    backgroundColor: "gray",
    //paddingVertical: 110,
    paddingHorizontal: 15,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },

  confirmButton: {
    marginTop: 20,
    // padding: 10,
    //backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    height: 60,
    width: "90%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText1: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    paddingTop: 10,
    //paddingBottom: 30,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
    //paddingTop: 10,
    //paddingBottom: 20,
    display: "flex",
    justifyContent: "space-between",
  },
  cart: {
    height: 200,
    width: "90%",
    // backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    border: 10,
  },
  SmallCart: {
    height: 50,
    width: "100%",
    //backgroundColor: "gray",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
});

export default ConfirmBooking;
