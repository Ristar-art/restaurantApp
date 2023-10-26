import React, { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Platform } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary functions
import { storage } from "../firebaseConfig"; // Make sure to import your firebase configuration

const ChooseAreaImage = ({ navigation }) => {
  const [subCollectionName, setSubCollectionName] = useState("");
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work.");
        }
      }
    })();
  }, []);

  const saveImageToCollection = async (uri) => {
    if (uri) {
      try {
        const response = await fetch(uri);
        const blob = await response.blob();
        const storageRef = ref(storage, `RestaurantImages/${parentId}`); // Make sure 'storage' is defined in your firebase configuration
        await uploadBytes(storageRef, blob);

        const imageUrl = await getDownloadURL(storageRef);

        await updateDoc(newDocRef, { imageurl: imageUrl });

        setImageURL(imageUrl); // Set the image URL in state
        navigation.navigate("RestaurantImage");
      } catch (error) {
        console.error("Error saving image to collection: ", error);
      }
    }
  };

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri); // Access the selected asset through the 'assets' array
        // Call the function to save the image to the collection here
        saveImageToCollection(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Error picking an image:", error);
    }
  };

  return (
    <View style={styles.Container}>
      <TextInput
        style={styles.inputField}
        placeholder="Enter Restaurant name"
        value={subCollectionName}
        onChangeText={(text) => setSubCollectionName(text)}
      />

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Choose an Image in your area</Text>
      </TouchableOpacity>
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
    width: "80%",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
  inputField: {
    height: 60,
    backgroundColor: "green",
    width: "80%",
    borderRadius: 10,
    padding: 5,
    borderWidth: 1,
  },
});

export default ChooseAreaImage;
