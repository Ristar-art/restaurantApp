import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const AdminPanel = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);
  
  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const db = getFirestore();
        const reservationsRef = collection(db, "Reservations");
        const reservationsSnapshot = await getDocs(reservationsRef);

        if (!reservationsSnapshot.empty) {
          const fetchedReservations = [];
          reservationsSnapshot.forEach((doc) => {
            fetchedReservations.push({ id: doc.id, ...doc.data() });
          });
          setReservations(fetchedReservations);
        } else {
          console.log("No reservations found.");
        }
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <View
      style={{
        backgroundColor: "black",
        justifyContent: "flext-start",
        flex: 1,
        flexDirection: "column",
        display: "flex",
        alignItems: "center",
      }}
    >
      <View
        style={{
          width: "80%",
          height: "10%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ borderRadius: 10, fontSize: 2 * 16, color: "white" }}>
          Reservations
        </Text>
      </View>

      <View
        style={{
          width: "100%",
          height: "100px",
          marginTop: "2px",
          height: "80%",
          //backgroundColor: "gray",
        }}
      >
        <FlatList
          data={reservations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: "white", borderRadius: 5 }}>
              <Text>User Name: {item.userName}</Text>
              <Text>Restaurant: {item.restaurant}</Text>
              <Text>Table: {item.table}</Text>
              <Text>Date: {item.date}</Text>
              <Text>Time: {item.time}</Text>
              <Text>Status: {item.status ? "Arrived" : "Yet to Arrive"} </Text>
            </View>
          )}
        />
      </View>
      <View
        style={{
          width: "100%",
          height: "10%",
          backgroundColor: "gray",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate("ManageRestaurant")}
        >
          <Text
            style={{
              borderTopLeftRadius: 10,
              borderTopRightRadius: 10,
              fontSize: 2 * 16,
              color: "white",
            }}
          >
            Manage the Restaurant
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AdminPanel;
