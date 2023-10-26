import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

const AddArestaurant= () => {
  const [subCollectionName, setSubCollectionName] = useState("");
  const [subCollectionNames, setSubCollectionNames] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [number, setNumber] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [parentId, setParentId] = useState("");
  const navigation = useNavigation();
  const firestore = getFirestore();
  const dataDocRef = doc(firestore, "DATA", "subCollectionNames");
  const dataCollectionRef = collection(firestore, "DATA");
  const [image, setImage] = useState(null);
  const [restaurantImage, setRestaurantImage] = useState(null);
  const [lastSubcollection, setLastSubcollection] = useState("");
  const [subAddress, setSubAddress] = useState("");
  const [restarentAddress, setRestarentAddress] = useState("");
  const [capacity, setCapacity] = useState(null);
  const [seatsNumber, setSeatsNumber] = useState(null);
  const [tableNumber, setTableNumber] = useState(null);
  const [peopleRating, setPeopleRating] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work.");
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
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking an image:", error);
    }
  };
  const pickRestaurantImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setRestaurantImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking a restaurant image:", error);
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
      console.error("Error fetching sub-collection names: ", error);
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
      console.log('parentId is: ',parentId)
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

      const newResraurentDocRef = await addDoc(subCollectionRef, {
        address: restarentAddress,
        name: subCollectionName,
        subcollection: subAddress,
        rating: 0,
        numberOfSeats: seatsNumber,
        ratingNumber: 0,
      });

      const restaurantId = newResraurentDocRef.id;

      console.log("restaurantImage is ", restaurantImage);
      if (restaurantImage) {
        const response = await fetch(restaurantImage);
        const blob = await response.blob();
        const storageRef = ref(
          storage,
          `AddressRestaurantImages/${restaurantId}`
        );
        await uploadBytes(storageRef, blob);

        const imageUrl = await getDownloadURL(storageRef);

        // Check if newResraurentDocRef exists before attempting to update
        if (newResraurentDocRef) {
          const url = await updateDoc(newResraurentDocRef, {
            restImageurl: imageUrl,
          });
          console.log("url is: ", url);
        } else {
          console.error("newResraurentDocRef is null. Image not updated.");
        }
      } else {
        console.warn("restaurantImage is null. Image not updated.");
      }
      // const docIdRef = newResraurentDocRef.id;
      const lastsubCollectionRef = collection(
        firestore,
        "DATA",
        parentId,
        subCollectionName,
        restaurantId,
        subAddress
      );
      // Add a new document to the sub-collection with an auto-generated ID and the selected address
      // const newDocRef = await addDoc(subCollectionRef, {
      //   address: selectTable,
      //   name: subCollectionName,
      //   subcollection: selectedAddress,

      // });

      // console.log('New document created successfully with ID:', newDocRef.id);
      // const subcollectionRef = collection(newDocRef, selectedAddress);

      // Automatically generate an ID for the document under subCollectionRef
      await addDoc(lastsubCollectionRef, {
        // You can add any fields here
        address: subAddress,
        available: true,
        Capacity: capacity,
        table: tableNumber,
      });
      // await fetchDocuments();

      setParentId(parentId);
    //  fetchSubCollectionNames();
      setSubCollectionName("");
      setImage("");
      setNumber("");
      setRestaurantImage(""); // Reset restaurantImage state
    } catch (error) {
      console.error("Error adding sub-collection name: ", error);
    }
  };

//   useEffect(() => {
//     fetchSubCollectionNames();
//   }, []);

  const handleRestaurantPress = async (item) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "DATA"));
      let parentId = null;

      querySnapshot.forEach((doc) => {
        if (doc.data().subCollection === item) {
          parentId = doc.id;
        }
      });

      if (parentId) {
        navigation.navigate("restaurantview", { item, parentId });
      } else {
        console.error("Restaurant not found.");
      }
    } catch (error) {
      console.error("Error handling restaurant press: ", error);
    }
  };

  return (
    <View style={styles.Container}>
  
        <>
          <TextInput 
            style={styles.inputField}
            placeholder="Enter Restaurant name"
            value={subCollectionName}
            onChangeText={(text) => setSubCollectionName(text)}
          />

          <TouchableOpacity style={styles.button} onPress={pickImage}>
            <Text style={styles.buttonText}>Choose Image</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.inputField}
            placeholder="Enter number of restaurants"
            value={number}
            onChangeText={(text) => setNumber(text)}
          />

          <TouchableOpacity style={styles.button} onPress={pickRestaurantImage}>
            <Text style={styles.buttonText}>Choose Restaurant Image</Text>
          </TouchableOpacity>

          <TextInput
            style={styles.inputField}
            placeholder="Select an address"
            value={restarentAddress}
            onChangeText={(text) => setRestarentAddress(text)}
           //style={styles.addressDropdown}
          />

          <TextInput
            placeholder="Select a Subaddress"
            value={subAddress}
            onChangeText={(text) => setSubAddress(text)}
            style={styles.inputField}
          />

          <TextInput
            placeholder="state number of seats"
            value={seatsNumber}
            onChangeText={(text) => setSeatsNumber(text)}
            style={styles.inputField}
          />

          <TextInput
            placeholder="Table Capacity"
            value={capacity}
            onChangeText={(text) => setCapacity(text)}
            style={styles.inputField}
          />

          <TextInput
            placeholder="Table Number"
            value={tableNumber}
            onChangeText={(text) => setTableNumber(text)}
            style={styles.inputField}
          />

          <TouchableOpacity style={styles.button} onPress={addSubCollectionName}>
            <Text style={styles.buttonText}>Add a restaurant</Text>
          </TouchableOpacity>
        </>
     


    
    </View>
  );
};

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: 40,
    backgroundColor: "black",
  },
  button: {
    backgroundColor: "blue",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    width:'80%',
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  inputField: {
    height:60,
    backgroundColor:'green',
    width:'80%',
    borderRadius:10,
    padding:5,
    borderWidth: 1,
  }
});

export default AddArestaurant;
