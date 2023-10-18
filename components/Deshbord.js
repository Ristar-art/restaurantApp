import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, Image, FlatList, TouchableOpacity } from 'react-native';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function DeshBord() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const navigation = useNavigation();

  useEffect(() => {
    const db = getFirestore();
    const dataRef = collection(db, 'DATA');

    getDocs(dataRef)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const validRestaurants = snapshot.docs.filter((doc) => {
            const imageUrl = doc.data().imageurl;
            return imageUrl && isURL(imageUrl); // Check if imageurl is present and a valid URL
          });

          setRestaurants(validRestaurants);
        } else {
          console.log('Firestore collection is empty.');
        }
      })
      .catch((error) => {
        console.error('Error retrieving data from Firestore:', error);
      })
      .finally(() => {
        setLoading(false); // Mark loading as complete
      });
  }, []);

  const handleRestaurantPress = (restaurantId, collectionName) => {
    //console.log('the collectionName in dashboard is: ', collectionName);
    navigation.navigate('RestaurantsDisplay', { restaurantId, collectionName });
  };

  const renderItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleRestaurantPress(item.id, item.data().subCollection)}>
      <View>
        {loading ? (
          // Display a loading indicator while fetching data
          <Text>Loading...</Text>
        ) : (
          // Render the image if not loading
          <Image source={{ uri: item.data().imageurl }} style={styles.starImage} />
        )}
        <View style={styles.areaCountContainer}>
          <Text style={styles.areaCountText}>{item.data().number}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <FlatList
          data={restaurants}
          renderItem={renderItem}
          keyExtractor={(item, index) => item.id}
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
    width: '100%',
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


function isURL(str) {
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return pattern.test(str);
}
