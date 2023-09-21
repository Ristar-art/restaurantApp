import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebaseConfig';

const ProfilePictureScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [userData, setUserData] = useState({}); // State to store user data
  const [editDropDown, setEditDropDown] = useState(false);

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

  useEffect(() => {
    // Fetch user data from Firestore when the component mounts
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const firestore = getFirestore();
      const userProfileRef = doc(firestore, 'Profile', user.uid);

      getDoc(userProfileRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            setUserData(docSnapshot.data());
          }
        })
        .catch((error) => {
          console.error('Error fetching user data:', error);
        });
    }
  }, []);

  
    
 

  const toggleEditDropDown = () => {
    setEditDropDown(!editDropDown);
  };

  // Check if the user has a profile image URL
  const hasProfileImage = userData.profileImage;
  
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        setImage(result.assets[0].uri); // Store the image URI in state
      }
    } catch (error) {
      console.error('Error picking an image:', error);
    }
  };

   const saveProfilePicture = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      // User is not authenticated, handle it as needed
      return;
    }

    if (!image) {
      // No image selected, handle it as needed
      alert('Please choose a profile picture before saving.');
      return;
    }

    try {
      // Upload the image to Firebase Storage
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      const response = await fetch(image);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      // Get the download URL of the uploaded image
      const imageUrl = await getDownloadURL(storageRef);
    

      // Update the user's profile data with the image URL without overwriting existing data
      const firestore = getFirestore();
      const userProfileRef = doc(firestore, 'Profile', user.uid);
      await updateDoc(userProfileRef, {
        profileImage: imageUrl, // Store the image URL
      });
      setEditDropDown(false);
      alert('Profile picture saved successfully');
    } catch (error) {
      console.error('Error saving profile picture:', error);
      // Handle the error as needed
    }
  };


  return (
    <View style={styles.container}>
      <View style={styles.picture}>
        {hasProfileImage ? (
          <Image source={{ uri: userData.profileImage }} style={styles.image} />
        ) : (
          image && <Image source={{ uri: image }} style={styles.image} />
        )}
      </View>
      <View style={styles.profile}>
        {/* Display user data */}
        <Text>{userData.firstName}</Text>
        <Text>{userData.lastName}</Text>
        <Text>{userData.email}</Text>

        {editDropDown ? (
          <View>
            <TouchableOpacity style={styles.button} onPress={pickImage}>
              <Text style={styles.buttonText}>Choose Profile Picture</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={saveProfilePicture}>
              <Text style={styles.buttonText}>Save Profile Picture</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.button} onPress={toggleEditDropDown}>
            <Text style={styles.buttonText}>Edit Profile Picture</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Background color for the whole screen
  },
  profile: {
    marginTop: 20,
    alignItems: 'center',
  },
  picture: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#fff', // Background color for the image container
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    fontSize: 40,
    textAlign: 'center',
    color: '#000',
    marginBottom: 10,
  },
  button: {
    backgroundColor: 'transparent',
    width: '80%',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 20,
    color: '#000',
  },
  loginLink: {
    fontSize: 20,
    color: 'blue',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});

export default ProfilePictureScreen;
