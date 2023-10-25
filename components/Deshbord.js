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

  const handleImagePress = (item) => {
    if (item && item.data) {     
      handleRestaurantPress(item.id, item.data().subCollection);
    }
  };

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
      <FlatList
          showsVerticalScrollIndicator={false}
          data={restaurants}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleImagePress(item)}>
              <View
                style={{
                  height: 250,
                  width: 150,
                  borderRadius: 32,
                  backgroundColor: "transparent",
                  alignItems: "center",
                  marginBottom: 20,
                  justifyContent: "space-between",
                }}
              >
                <View
                  style={{
                    marginTop: 30,
                    height: 180,
                    width: 140,
                    borderRadius: 30,
                  }}
                >
                  <Image
                    source={{ uri: item.data().imageurl }}
                    style={{ flex: 1, borderRadius: 30 }}
                  />
                </View>
                <View
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "white", fontSize: 16, fontWeight: "bold" }}
                  >
                    {item.data().subCollection}
                  </Text>
                  <Text style={{ color: "gray", fontSize: 16 }}>
                    {item.data().number}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id.toString()}
          numColumns={2}
          columnWrapperStyle={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    flex: 1,
    backgroundColor: 'white',
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
    backgroundColor: 'white',
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
