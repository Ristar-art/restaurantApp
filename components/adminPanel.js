// import React, { useState } from 'react';
// import { View, StyleSheet, Button, TextInput } from 'react-native';
// import firestore from '@react-native-firebase/firestore';
// import { Picker } from '@react-native-picker/picker';
// import { getFirestore, collection, addDoc } from "firebase/firestore";

// const AdminPanel = () => {
//   const [selectedIndex, setSelectedIndex] = useState('1'); 
//   const [numberOfPlaces, setNumberOfPlaces] = useState(0);

//   const handleSendData = async () => {
//     if (numberOfPlaces > 0) {
//       try {
        // const db = getFirestore();
//         const dataRef = collection(db, 'data');

//         console.log('dataRef: ', dataRef);
//         const docRef = await addDoc(dataRef, {
//           index: parseInt(selectedIndex),
//           places: numberOfPlaces,
//         });
        
  
//         console.log('Data sent successfully.',docRef);
//       } catch (e) {
//         console.error("Error adding document: ", e);
//       }
//     } else {
//       console.log('Invalid input. Please provide the number of places.');
//     }
//   };
  

//   return (
//     <View style={styles.container}>
//       <Picker
//         selectedValue={selectedIndex}
//         onValueChange={(itemValue) => setSelectedIndex(itemValue)}
//         style={styles.picker}
//       >
//         {Array.from({ length: 20 }, (_, index) => (
//           <Picker.Item key={index} label={String(index + 1)} value={String(index + 1)} />
//         ))}
//       </Picker>
//       <TextInput
//         placeholder="Number of Places"
//         keyboardType="numeric"
//         value={numberOfPlaces !== 0 ? numberOfPlaces.toString() : ''}
//         onChangeText={(text) => {
          
//           if (!isNaN(text)) {
//             setNumberOfPlaces(Number(text));
//           }
//         }}
//         style={styles.input}
//       />
//       <Button title="Send Data" onPress={handleSendData} />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   picker: {
//     width: 200,
//     height: 40,
//     borderWidth: 1,
//     marginVertical: 10,
//   },
//   input: {
//     width: 200,
//     height: 40,
//     borderWidth: 1,
//     marginVertical: 10,
//     paddingHorizontal: 10,
//   },
// });

// export default AdminPanel;
