import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { setIsLoggedIn, setIsLoading } from '../authSlice';
import BackgroundImage from './BackgroundImage';
import { auth, storage } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import ProfilePictureScreen from './profilePicture';
import * as ImagePicker from 'expo-image-picker';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, setDoc,getStorage } from 'firebase/firestore';
import { ref, uploadBytes,getDownloadURL } from 'firebase/storage';



export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector(state => state.auth);
  const userRole = useSelector(state => state.userRole); 
  
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
   // console.log('result is: ', result);
   console.log('Image URI set:', result.assets[0].uri);

    if (!result.cancelled) {
    console.log('setImage is happening')
      setImage(result.assets[0].uri);
      console.log('image is: ' ,image)
    }

    
    
  } catch (error) {
    console.error('Error picking an image:', error);
  }
};

const saveProfilePicture = async () => {
  const auth = getAuth();
  const user = auth.currentUser;
  console.log('user is: ', user)
  if (!user) {
    // User is not authenticated, handle it as needed
    return;
  }

  console.log('Image URI before saving:', image);

  if (!image) {
    // No image selected, handle it as needed
    alert('Please choose a profile picture before saving.');
    return;
  }

  const firestore = getFirestore();
  const userProfileRef = doc(firestore, 'Profile', user.uid);

  try {
    // Upload the image to Firebase Storage
    const storageRef = ref(storage, `profileImages/${user.uid}`);
    console.log('storageRef is: ', storageRef);
    const response = await fetch(image);
    const blob = await response.blob();
    await uploadBytes(storageRef, blob);

    // Get the download URL of the uploaded image
    const imageUrl = await getDownloadURL(storageRef);
    console.log('imageUrl is: ', imageUrl);

    // Save the image URL in Firestore
    await setDoc(userProfileRef, {
      profileImage: imageUrl, // Store the image URL
    });

    // Profile picture saved successfully
    alert('Profile picture saved successfully');
  } catch (error) {
    console.error('Error saving profile picture:', error);
    // Handle the error as needed
  }
};

  
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      dispatch(setIsLoggedIn(!!user));
      dispatch(setIsLoading(false));
    });

    signOut(auth);

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  const isAdmin = isLoggedIn && userRole === 'admin';


  const images = [
    'https://www.blessthismessplease.com/wp-content/uploads/2017/02/DSC_8887-2.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/california-grilled-chicken-index-647a382d5880c.jpg?crop=0.502xw:1.00xh;0.260xw,0&resize=640:*',
    'https://assets.epicurious.com/photos/566af1a508cf542b399e1457/1:1/w_775%2Cc_limit/EP_12112015_garlicsoup.jpg',
  ];

  const handleImagePress = () => {
    console.log('handleImagePress function is called');
    console.log('isLoggedIn is:', isLoggedIn, 'isAdmin is:', isAdmin); // Add this line
    if (isLoggedIn) {
      console.log('Navigating to admin panel');
      // if (isAdmin) {
      //   navigation.navigate('admin'); // Navigate to AdminPanel for admins
      // } else {
      //   // Handle access denied for non-admin users
      //   alert('You do not have permission to access this feature.');
      // }
      navigation.navigate('admin')
    } else {
      // Handle access denied for not logged-in users
      alert('You need to log in to access this feature.');
      navigation.navigate('Login');
    }
  };

  const viewProfile=()=>{

    // console.log('the pofile should appear')
    // <ProfilePictureScreen/>
  }
  
  return (
    <View style={styles.container}>
      <BackgroundImage />
     
          <View style={styles.profile} >
             <TouchableOpacity onPress={viewProfile}>
               <Icon name="user" size={60} color="black" />
               
             </TouchableOpacity>
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
      
     
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardText}>The last Supper</Text>
          <View style={styles.smallerText}>
            <Text style={styles.cardExplanation}>Eat my flesh, and drink my blood.</Text>
            <Text style={styles.cardExplanation}>The words that I speak to you, they are spirit and they are life.</Text>
          </View>
          <View style={styles.starsContainer}>
            <Icon name="star" size={10} color="gold" />
            <Icon name="star" size={10} color="gold" />
            <Icon name="star" size={10} color="gold" />
            <Icon name="star" size={10} color="gold" />
            <Icon name="star" size={10} color="gold" />
            <Text style={styles.cardExplanation}>6000</Text>
          </View>
          
        </View>
      </View>

      <View style={styles.cardContainer2}>
        <View style={styles.card}>
          <View style={styles.starsContainer}>
            {images.map((image, index) => (
              <TouchableOpacity key={index} onPress={() => navigation.navigate('deshbord')}>
                <Image source={{ uri: image }} style={styles.starImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.starsContainer}>
        <View style={styles.spaceBetween}>
          <Icon name="home" size={60} color="white" />
        </View>
        <View style={styles.spaceBetween}>
          <Icon name="globe" size={60} color="gold" />
        </View>
        <View style={styles.spaceBetween}>
          <Icon name="star" size={60} color="gray" onPress={handleImagePress} />
        </View>
        <View style={styles.spaceBetween}>
          <Icon name="user" size={60} color="gray" onPress={() => navigation.navigate('Login')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  cardContainer: {
    position: 'absolute',
    top: 172,
    left: 50,
    right: 50,

    alignItems: 'center',
    maxWidth: 350,
  },
  profile:{
    position: 'absolute',
    top: 0,   
    left: 280,
    zIndex:2,
    backgroundColor:'brown',
    width:70,
    height:70,
    alignItems: 'center',
    borderRadius: 50
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 0,
  },
  smallerText: {
    marginBottom: 10,
  },
  cardExplanation: {
    fontSize: 12,
    top: 0,
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spaceBetween: {
    padding: 20,
  },
  starImage: {
    width: 110,
    height: 100,
    resizeMode: 'contain',
  },
});
