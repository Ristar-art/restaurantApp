import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList ,TouchableOpacity} from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';

const AdminPanel = ({ navigation }) => {
  const [reservations, setReservations] = useState([]);

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const db = getFirestore();
        const reservationsRef = collection(db, 'Reservations');
        const reservationsSnapshot = await getDocs(reservationsRef);

        if (!reservationsSnapshot.empty) {
          const fetchedReservations = [];
          reservationsSnapshot.forEach((doc) => {
            fetchedReservations.push({ id: doc.id, ...doc.data() });
          });
          setReservations(fetchedReservations);
        } else {
          console.log('No reservations found.');
        }
      } catch (error) {
        console.error('Error fetching reservations:', error);
      }
    };

    fetchReservations();
  }, []);

  return (
    <View style={styles.container}>

      <View style={styles.reservation}>
      <Text style={styles.header}>Reservations</Text>
      <FlatList
        data={reservations}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.reservationContainer}>
            <Text>User Name: {item.userName}</Text>
            <Text>Restaurant: {item.restaurant}</Text>
            <Text>Table: {item.table}</Text>
            <Text>Date: {item.date}</Text>
            <Text>Time: {item.time}</Text>
            <Text>Status: {item.status ? 'Arrived' : 'Yet to Arrive' } </Text>
          </View>
        )}
      />
      </View>
       <View style={styles.management}>

       
       <TouchableOpacity onPress={() => navigation.navigate('ManageRestaurant')}>
        <Text style={styles.Btn}> Manage the Restaurant </Text>
       </TouchableOpacity>
    
       </View>
      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red',
   // alignItems: 'center',
    justifyContent: 'center',
    // width:'100%',
    // height:'100%'
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    top:20
  },
  reservationContainer: {
    borderWidth: 1,
    borderColor: '#000',
    //padding: 10,
    marginVertical: 5,
    borderRadius:5,
    //width: '80%'
  },
  reservation:{
    flex:1,
  },
 Btn: {
    height:60,
    backgroundColor:'green',
    width:'80%',
    borderRadius:10,
    padding:5,
    borderWidth: 1,
  },
  management:{
    flexDirection:'row',
    justifyContent: "space-between",
    flex:1
  }
});

export default AdminPanel;
