import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity, Button } from 'react-native';
import { getFirestore, collectionGroup, getDocs, updateDoc, collection } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function RestaurantsDisplay() {
  const [restaurantData, setRestaurantData] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedDateTime, setSelectedDateTime] = useState(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableDateTimes, setTableDateTimes] = useState({});
  const route = useRoute();
  const restaurantId = route.params?.restaurantId;
  const collectionName = route.params?.collectionName;
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [tableSubcollectionName, setTableSubcollectionName] = useState(null); // Add this line
  const [selectedTableId, setSelectedTableId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();
  
        if (!restaurantId) {
          console.log('No restaurant ID found.');
          setLoading(false);
          return;
        }
  
        const querySnapshot = await getDocs(collectionGroup(db, collectionName));
  
        if (!querySnapshot.empty) {
          const data = [];
  
          for (const doc of querySnapshot.docs) {
            const imageUrl = doc.data().restImageurl;
            const address = doc.data().address;
            const rating = doc.data().rating;
            const ratedPeople = doc.data().ratingNumber;
            const TablesubcollectionName = doc.data().subcollection;
          
            if (imageUrl && TablesubcollectionName) {
              const tableData = await fetchTableData(db, TablesubcollectionName);
          
              // Set the tableSubcollectionName here
              setTableSubcollectionName(TablesubcollectionName);
          
              data.push({
                imageUrl,
                address,
                rating,
                ratedPeople,
                TablesubcollectionName,
                tableData,
              });
            }
          }
          
  
          // Set the tableSubcollectionName here
          if (data.length > 0) {
            setTableSubcollectionName(data[0].TablesubcollectionName);
          }
  
          setRestaurantData(data);
          setLoading(false);
        } else {
          console.log(`No documents found in the "${collectionName}" subcollection.`);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };
  
    fetchData();
  }, [restaurantId, collectionName]);
  
  async function fetchTableData(db, subcollectionName) {
    const tableData = [];
    console.log('subcollectionName is ',subcollectionName)
    try {
      const queryTableSnapshot = await getDocs(collectionGroup(db, subcollectionName));
      for (const doc of queryTableSnapshot.docs) {
        const Capacity = doc.data().Capacity;
        const table = doc.data().table;
        const available = doc.data().available;

        if (available) {
          tableData.push({ Capacity, table });
        }
      }
    } catch (error) {
      console.error('Error fetching table data:', error);
    }

    return tableData;
  }

  const showTimePicker = () => {
    setDatePickerVisibility(false); // Hide the date picker
    setTimePickerVisibility(true); // Show the time picker
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleButtonPress = (item) => {
    setSelectedItem(selectedItem === item ? null : item);
  };

  const showDatePicker = (table) => {
    const { TablesubcollectionName } = table;
    setSelectedTable(table); // Update the selectedTable state
    setSelectedTableId(table.table); // Use the table id
    setDatePickerVisibility(true);
    console.log('TablesubcollectionName: ', tableSubcollectionName);
  };
  
  

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateAndTimeConfirm = (dateAndTime) => {
  if (isDatePickerVisible) {
    // When the date is selected, we only set the selected date
    setSelectedDate(dateAndTime);

    // Calculate the timezone offset in minutes for the selected date
    const timezoneOffsetMinutes = selectedDate.getTimezoneOffset();

    // Create a new date object with the correct timezone offset
    const adjustedTime = new Date(dateAndTime.getTime() - timezoneOffsetMinutes * 60000);

    setSelectedDateTime(adjustedTime); // Set the selected date and time
    showTimePicker(); // Show the time picker
  } else if (isTimePickerVisible) {
    // When the time is selected, we set the selected time
    setSelectedTime(dateAndTime);

    // Calculate the timezone offset in minutes for the selected date
    const timezoneOffsetMinutes = selectedDate.getTimezoneOffset();

    // Create a new date object with the correct timezone offset
    const adjustedTime = new Date(dateAndTime.getTime() - timezoneOffsetMinutes * 60000);

    // Store the adjusted time for the selected table in the tableDateTimes object
    setTableDateTimes((prevTableDateTimes) => ({
      ...prevTableDateTimes,
      [selectedTable.table]: adjustedTime,
    }));

    hideTimePicker(); // Hide the time picker
    console.log('dateAndTime is: ', adjustedTime);
  }
};
  const bookTable = async () => {
    if (selectedTableId && selectedDateTime && tableSubcollectionName) {
      try {
        const db = getFirestore();
  
        // Query the specific subcollection using collectionGroup
        const queryTableSnapshot = await getDocs(
          collectionGroup(db, tableSubcollectionName)
        );
  
        for (const doc of queryTableSnapshot.docs) {
          const tableData = doc.data();
  
          // Compare the table field in the document data with selectedTableId
          if (tableData.table === selectedTableId) {
            const tableDocRef = doc.ref;
  
            await updateDoc(tableDocRef, {
              bookedDateTime: selectedDateTime.toISOString(),
              available: false,
            });
  
            setRestaurantData((prevData) => {
              const updatedData = [...prevData];
              const restaurantIndex = updatedData.findIndex(
                (item) => item === selectedItem
              );
              if (restaurantIndex !== -1) {
                const tableIndex = updatedData[restaurantIndex].tableData.findIndex(
                  (tableItem) => tableItem.table === selectedTableId
                );
                if (tableIndex !== -1) {
                  updatedData[restaurantIndex].tableData[tableIndex].available = false;
                }
              }
              return updatedData;
            });
  
            setSelectedDateTime(null);
            setSelectedDate(null);
            setSelectedTime(null);
  
            console.log('Table booked successfully.');
            break; // Exit the loop once the table is found and updated
          }
        }
      } catch (error) {
        console.error('Error booking table:', error);
      }
    } else {
      console.error('Selected table or date/time is null.');
    }
  };
  
  
  
  
  
  
  return (
    <View style={styles.listContainer}>
      <FlatList
        data={restaurantData}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <TouchableOpacity onPress={() => handleButtonPress(item)}>
              <View style={styles.itemContent}>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <View style={styles.detailsContainer}>
                  <View style={styles.text}>
                    <Text>{item.address}</Text>
                  </View>
                  <View style={styles.text}>
                    <Text>{item.rating}</Text>
                  </View>
                  <View style={styles.text}>
                    <Text>{item.ratedPeople}</Text>
                  </View>
                  <View style={styles.viewContainer}>
                    <Icon
                      name={selectedItem === item ? 'chevron-up' : 'chevron-down'}
                      size={10}
                      color="white"
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            {selectedItem === item && (
              <View style={styles.reservationDetailsContainer}>
                <Text style={styles.reservationDetailsText}>Reservation Details:</Text>
                <FlatList
                  data={item.tableData}
                  renderItem={({ item: tableItem }) => (
                    <View style={styles.tableItem}>
                      <Text>Table Number: {tableItem.table}</Text>
                      <Text>Capacity: {tableItem.Capacity}</Text>
                      {selectedDateTime ? (
                        <View>
                          <Text>
                            Date & Time:{' '}
                            {tableItem.table in tableDateTimes
                              ? tableDateTimes[tableItem.table].toLocaleString()
                              : 'Not selected'}
                          </Text>
                          <Button
                            title="Book"
                            onPress={() => bookTable(tableItem)}
                            disabled={!tableDateTimes[tableItem.table]}
                          />
                        </View>
                      ) : (
                        <View>
                          <TouchableOpacity onPress={() => showDatePicker(tableItem)}>
                            <Text>{selectedDateTime ? 'Edit Date & Time' : 'Pick Date & Time'}</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      {isDatePickerVisible && (
                        <DateTimePicker
                          value={selectedDate || new Date()}
                          mode="date"
                          display="default"
                          onChange={(event, dateAndTime) => handleDateAndTimeConfirm(dateAndTime)}
                        />
                      )}
                      {isTimePickerVisible && (
                        <DateTimePicker
                          value={selectedTime || new Date()}
                          mode="time"
                          display="default"
                          onChange={(event, dateAndTime) => handleDateAndTimeConfirm(dateAndTime)}
                        />
                      )}
                    </View>
                  )}
                  keyExtractor={(item, index) => index.toString()}
                />
              </View>
            )}
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContainer: {
    top: 40,
  },
  itemContainer: {
    width: '80%',
    marginLeft: 10,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 0,
  },
  image: {
    width: '50%',
    height: 100,
    resizeMode: 'cover',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: 200,
    height: 100,
    marginRight: 20,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
  viewContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reservationDetailsContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '80%',
    position: 'relative',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 58,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  reservationDetailsText: {
    fontWeight: 'bold',
  },
  tableItem: {
    marginVertical: 10,
  },
});