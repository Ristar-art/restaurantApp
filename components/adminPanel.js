import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; 
import { storage } from '../firebaseConfig';

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
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== 'web') {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work.');
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.uri); 
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

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
        number: number,
      });
  
      const parentId = newDocRef.id;
     
      if (image) {
        const response = await fetch(image);
        const blob = await response.blob();
        const storageRef = ref(storage, `RestaurantImages/${parentId}`);
        await uploadBytes(storageRef, blob);
  
        
        const imageUrl = await getDownloadURL(storageRef);
        
        
        await updateDoc(newDocRef, { imageurl: imageUrl });
  
        setImageURL(imageUrl); // Set the image URL in state
      }
  
      const subCollectionRef = collection(newDocRef, subCollectionName);
  
      await addDoc(subCollectionRef, {
        address: 'maluti',
        name: subCollectionName,
      });
  
      setParentId(parentId);
      fetchSubCollectionNames();
      setSubCollectionName('');
      setImage('');
      setNumber('');
    } catch (error) {
      console.error('Error adding sub-collection name: ', error);
    }
  };
  

  useEffect(() => {
    fetchSubCollectionNames();
  }, []);

  const handleRestaurantPress = async (item) => {
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
        placeholder="Enter Restaurant name"
        value={subCollectionName}
        onChangeText={(text) => setSubCollectionName(text)}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose Image</Text>
      </TouchableOpacity>

      <TextInput
        placeholder="Enter number of restaurants"
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
