import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity, Button,ImageBackground } from 'react-native';
import { getFirestore, collectionGroup, getDocs, updateDoc, collection,doc, getDoc} from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../firebaseConfig';
import { setIsLoggedIn, setIsLoading } from '../authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged } from 'firebase/auth';


function isURL(str) {
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return pattern.test(str);
}

export default function RestaurantsDisplay({ navigation }) {

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
  const [restaurantImage, setRestaurantImage] = useState(null);
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector(state => state.auth);
  const [restaurant, setRestaurant] = useState([]);
 
 

  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const db = getFirestore();
        const restaurantRef = doc(db, 'DATA', restaurantId); // Adjust the document reference
        const restaurantSnapshot = await getDoc(restaurantRef); // Adjust the method for getting a single document

        if (restaurantSnapshot.exists()) {
          const restaurantData = restaurantSnapshot.data();
          if (restaurantData.imageurl && isURL(restaurantData.imageurl)) {
            setRestaurantImage(restaurantData.imageurl);
          }
        } else {
          console.log('No restaurant found with the provided ID.');
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      dispatch(setIsLoggedIn(!!user));
      dispatch(setIsLoading(false));
    });

    // signOut(auth);

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }
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
           // console.log('rating is: ',rating)
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
    //console.log('subcollectionName is ',subcollectionName)
    try {
      const queryTableSnapshot = await getDocs(collectionGroup(db, subcollectionName));
      //console.log('queryTableSnapshot.docs is',queryTableSnapshot.docs)
      for (const doc of queryTableSnapshot.docs) {
        const Capacity = doc.data().Capacity;
        const table = doc.data().table;
        const available = doc.data().available;
       

        if (available) {
          tableData.push({ Capacity, table });
          // console.log('Capacity is: ',Capacity)
          // console.log('table is: ',table)
          // console.log('available is: ',available)
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
    //console.log('TablesubcollectionName: ', tableSubcollectionName);
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
    //console.log('dateAndTime is: ', adjustedTime);
  }
};
const bookTable = async () => {
  if (!isLoggedIn) {
    // User is not logged in, navigate to the login page
    navigation.navigate('Login'); // Replace 'Login' with the actual name of your login screen
    return;
  }
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

          // Navigate back to the previous screen after booking
          navigation.goBack();

          //console.log('Table booked successfully.');
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
         {restaurantImage ? (
        <ImageBackground source={{ uri: restaurantImage }} style={styles.imageBackground} />
      ) : (
        <Text>Loading background image...</Text>
      )}
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
                    <View style={styles.tableItme}>
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
                        <View style={styles.booking}>
                          <TouchableOpacity onPress={() => showDatePicker(tableItem)}>
                            <Text>  {selectedDateTime ? 'Edit Booking' : 'Pick a Time & Date'}</Text>
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
  listContainer: {
    flex:1,   
    justifyContent: 'center',
    backgroundColor:'black'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
   

  },
  imageBackground: {
    height: 180,
    resizeMode: "cover",
  },
  noDataContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor:'green'
  },
  
  itemContainer: {
    paddingTop:10,
    flex:1,
    //backgroundColor:'red',
    paddingHorizontal: 12,
    paddingBottom:10,
    
  },
  tableItem: {
     marginVertical: 10,
    //flex:1,
    paddingBottom:10,
    backgroundColor:'blue'
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
    width: '50%',
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
    marginLeft: 38,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  booking:{
      backgroundColor:'#90ffff',
      height: 30,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius:15,
      paddingHorizontal:2,
      
  },
  reservationDetailsText: {
    fontWeight: 'bold',
  },
 
});
