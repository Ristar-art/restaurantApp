import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

const ProfilePictureScreen = () => {
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
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const saveProfilePicture = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      // User is not authenticated, handle it as needed
      return;
    }

    const firestore = getFirestore();
    const userProfileRef = doc(firestore, 'Profile', user.uid);

    try {
      await setDoc(userProfileRef, {
        profileImage: image, // Store the image URI
      });

      // Profile picture saved successfully
      alert('Profile picture saved successfully');
    } catch (error) {
      console.error('Error saving profile picture:', error);
      // Handle the error as needed
    }
  };

  return (
    <View>
      <Text>Profile Picture Screen</Text>
      <TouchableOpacity onPress={pickImage}>
        <Text>Choose Profile Picture</Text>
      </TouchableOpacity>
      {image && (
        <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />
      )}
      <TouchableOpacity onPress={saveProfilePicture}>
        <Text>Save Profile Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfilePictureScreen;
