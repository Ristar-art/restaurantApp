import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getFirestore, collectionGroup, getDocs } from "firebase/firestore";
import { useNavigation, useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";

const ChooseTable = () => {
  const route = useRoute();
  const restaurantId = route.params?.restaurantId;
  const restaurantName = route.params?.restaurantName;
  const collectionName = route.params?.CollectionName;
  const documentID = route.params?.documentID;
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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
        console.log("No table data found for the selected collection.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching table data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [collectionName]);

  const handleSelectDate = (event, selectedDate,item) => {
    const currentDate = selectedDate;
    setDate(currentDate);   
    
    if (selectedItem) {
      setShowDatePicker(false);
      ShowTimePicker();
      
    }
  };

  const handleSelectTime = (event, selectedTime) => {
    const currentTime = selectedTime;
    setTime(currentTime);
    if (selectedItem) {
      setShowTimePicker(false)
      navigation.navigate("ConfirmBooking", {
        restaurantId: restaurantId,
        restaurantName: restaurantName,
        collectionName: collectionName,
        documentID: documentID,
        tableId: selectedItem.id,
        tableNumber: selectedItem.table,
        date: date.toISOString(),
        time: time.toTimeString(),
      });
    }
  };

  const showTheDatePicker = (item) => {
    setSelectedItem(item);
    
    setShowDatePicker(true);
  };

  const ShowTimePicker = () => {
    setShowTimePicker(true);  
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        backgroundColor: "black",
        alignItems: "center",
        top: 17,
      }}
    >
      <View>
        <Text style={styles.header}>Choose a Table</Text>
        <FlatList
          data={tableData}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => showTheDatePicker(item)}
            >
              <View style={styles.tableItem}>
                <View style={styles.tableNumber}>
                  <Text style={styles.text}>Table: {item.table}</Text>
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

      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode="date"
          display="default"
          onChange={handleSelectDate}
        />
      )}
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={time}
          mode="time"
          display="default"
          onChange={handleSelectTime}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "black",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
  },
  datePickerButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "gray",
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  tableItem: {
    borderWidth: 1,
    padding: 20,
    margin: 10,
    backgroundColor: "gray",
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
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
