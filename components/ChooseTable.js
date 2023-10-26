import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, collectionGroup, getDocs } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';

const ChooseTable = () => {
  const route = useRoute();
  const restaurantId = route.params?.restaurantId;
 
  const restaurantName = route.params?.restaurantName;
  
  const collectionName = route.params?.CollectionName;
 
  const documentID =  route.params?.documentID;

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const fetchTableData = async () => {
    try {
      const db = getFirestore();
      const querySnapshot = await getDocs(collectionGroup(db, collectionName));

      if (!querySnapshot.empty) {
        const data = querySnapshot.docs
          .map((doc) => ({
            id: doc.id, // Extracting the document ID
            ...doc.data(),
          }))
          .filter((item) => item.available === true);
        setTableData(data);
        setLoading(false);
      } else {
        console.log('No table data found for the selected collection.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [collectionName]);

  const handleSelectDate = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setDate(currentDate);
    setShowDatePicker(false);
  };

  const handleSelectTime = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setTime(currentTime);
    setShowTimePicker(false);
  };

  const showDateTimePicker = () => {
    setShowDatePicker(true);
  };

  const ShowTimePicker = () => {
    setShowTimePicker(true);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Choose a Table</Text>
      <TouchableOpacity onPress={showDateTimePicker} style={styles.datePickerButton}>
        <Text style={styles.buttonText}>Select Date</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={ShowTimePicker} style={styles.datePickerButton}>
        <Text style={styles.buttonText}>Select Time</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="datePicker"
          value={date}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={handleSelectDate}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          testID="timePicker"
          value={time}
          mode="time"
          is24Hour={true}
          display="default"
          onChange={handleSelectTime}
        />
      )}
      <FlatList
        data={tableData}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('ConfirmBooking', {
                restaurantId:restaurantId,
                restaurantName: restaurantName,
                collectionName: collectionName,
                documentID:documentID,
                tableId: item.id,
                tableNumber: item.table,
                date: date.toISOString(),
                time: time.toTimeString(),
                
              })
            }
          >
            <View style={styles.tableItem}>
              <View style={styles.tableNumber}>
                <Text style={styles.text}>Table : {item.table}</Text>
              </View>

              <View style={styles.tableCapacity}>
                <Text style={styles.text}>Capacity: {item.Capacity}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
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
  datePickerButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'gray',
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableItem: {
    borderWidth: 1,
    padding: 20,
    margin: 10,
    backgroundColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 0,
  },
  tableNumber: {
    paddingRight: 40,
  },
  tableCapacity: {
    paddingLeft: 40,
  },
});

export default ChooseTable;
