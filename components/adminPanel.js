import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { getFirestore, doc, getDoc, setDoc, collection, addDoc, getDocs } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const AdminPanel = () => {
  const [subCollectionName, setSubCollectionName] = useState('');
  const [subCollectionNames, setSubCollectionNames] = useState([]);
  const [imageURL, setImageURL] = useState('');
  const [number, setNumber] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [parentId, setParentId] = useState('');
  const navigation = useNavigation();
  const firestore = getFirestore();
  const dataDocRef = doc(firestore, 'DATA', 'subCollectionNames');
  const dataCollectionRef = collection(firestore, 'DATA');
 

 
  const fetchSubCollectionNames = async () => {
   
    try {
      const docSnapshot = await getDoc(dataDocRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setSubCollectionNames(data.names || []);
      }
    } catch (error) {
      console.error('Error fetching sub-collection names: ', error);
    }
  };

  const addSubCollectionName = async () => {
   
    try {
      const docSnapshot = await getDoc(dataDocRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data() || { names: [] };
        data.names.push(subCollectionName);
        await setDoc(dataDocRef, data);
      } else {
        await setDoc(dataDocRef, { names: [subCollectionName] });
      }

      const newDocRef = await addDoc(dataCollectionRef, {
        subCollection: subCollectionName,
        imageurl: imageURL,
        number: number,
      });

      const parentId = newDocRef.id;
      const subCollectionRef = collection(newDocRef, subCollectionName);

      await addDoc(subCollectionRef, {
        address: 'maluti',
        name: subCollectionName,
      });

      setParentId(parentId);
      fetchSubCollectionNames();
      setSubCollectionName('');
      setImageURL('');
      setNumber('');
    } catch (error) {
      console.error('Error adding sub-collection name: ', error);
    }
  };

  const handleRestaurantPress = async (item) => {
    const userRole = useSelector(state => state.auth.userRole);

    if (!isLoggedIn) {
      navigation.navigate('Login');
      return;
    }

    if (userRole !== 'admin') {
      alert('You do not have permission to access this feature.');
      return;
    }

    try {
      const querySnapshot = await getDocs(collection(firestore, 'DATA'));
      let parentId = null;

      querySnapshot.forEach((doc) => {
        if (doc.data().subCollection === item) {
          parentId = doc.id;
        }
      });

      if (parentId) {
        navigation.navigate('restaurantview', { item, parentId });
      } else {
        console.error('Restaurant not found.');
      }
    } catch (error) {
      console.error('Error handling restaurant press: ', error);
    }
  };


  return (
    <View style={styles.Container}>
      <TextInput
        placeholder="Enter Restaurent name"
        value={subCollectionName}
        onChangeText={(text) => setSubCollectionName(text)}
      />

      <TextInput
        placeholder="Enter image URL"
        value={imageURL}
        onChangeText={(text) => setImageURL(text)}
      />

      <TextInput
        placeholder="Enter number of restaurents"
        value={number}
        onChangeText={(text) => setNumber(text)}
      />

      <TouchableOpacity style={styles.button} onPress={addSubCollectionName}>
        <Text style={styles.buttonText}>Add a restaurant</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text style={styles.buttonText}>Restaurant Names</Text>
      </TouchableOpacity>

      {showDropdown && (
        <FlatList
          data={subCollectionNames}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleRestaurantPress(item)}>
              <View>
                <Text>{item}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    top: 40,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    margin: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default AdminPanel;
