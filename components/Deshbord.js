import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

export default function Dashboard() {
  const [images, setImages] = useState([]);
  const [nameOfAreas, setNameOfAreas] = useState([]);
  const [restaurantData, setRestaurantData] = useState([]);
  const [collectionName,setCollectionName] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const db = getFirestore();
    const dataRef = collection(db, 'DATA');

    getDocs(dataRef)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const imageUrls = snapshot.docs.map((doc) => doc.data().imageurl);
          const nameOfAreas = snapshot.docs.map((doc) => doc.data().number);
          const collectionName = snapshot.docs.map((doc) => doc.data().subCollection);         
          const restaurants = snapshot.docs.map((doc) => ({
            id: doc.id,
            // other restaurant data...
          }));

          setImages(imageUrls);
          setNameOfAreas(nameOfAreas);
          setRestaurantData(restaurants);
          setCollectionName(collectionName);
        } else {
          console.log('Firestore collection is empty.');
        }
      })
      .catch((error) => {
        console.error('Error retrieving data from Firestore:', error);
      });
  }, []);

  
  const handleRestaurantPress = (restaurantId,collectionName) => {
    console.log('the collectionName in deshbord is: ',collectionName)
    navigation.navigate('RestaurantsDisplay', { restaurantId,collectionName });
  };
  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleRestaurantPress(restaurantData[index].id, collectionName[index])}>
      <View>
        <Image source={{ uri: item }} style={styles.starImage} />
        <View style={styles.areaCountContainer}>
          <Text style={styles.areaCountText}>{nameOfAreas[index]}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <FlatList
          data={images}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          numColumns={2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    bottom: 0,
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
   // marginBottom: 20,
    maxWidth: 400,
    alignItems: 'center',
    width:'100%'
  },
  starImage: {
    width: 130,
    height: 150,
    resizeMode: 'cover',
    margin: 10,
    borderRadius: 5,
    //padding: 1,
  },
  areaCountContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 5,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  areaCountText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
