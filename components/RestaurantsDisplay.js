import React, { useEffect, useState } from 'react';
import { Text, View, FlatList, Image, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { getFirestore, collectionGroup, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigation, useRoute } from '@react-navigation/native';


function isURL(str) {
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return pattern.test(str);
}

export default function RestaurantsDisplay() {

  const [restaurantData, setRestaurantData] = useState([]);
  const [restaurantImage, setRestaurantImage] = useState(null);
  const route = useRoute();
  const restaurantId = route.params?.restaurantId;

  const collectionName = route.params?.collectionName;
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation(); 
  useEffect(() => {
    const fetchRestaurantData = async () => {
      try {
        const db = getFirestore();
        const restaurantRef = doc(db, 'DATA', restaurantId); // Adjust the document reference
        const restaurantSnapshot = await getDoc(restaurantRef); // Adjust the method for getting a single document

        if (restaurantSnapshot.exists()) {
          const restaurantData = restaurantSnapshot.data();
          if (restaurantData.imageurl && isURL(restaurantData.imageurl)) {
            setRestaurantImage(restaurantData.imageurl);
          }
        } else {
          console.log('No restaurant found with the provided ID.');
        }
      } catch (error) {
        console.error('Error fetching restaurant data:', error);
      }
    };

    fetchRestaurantData();
  }, [restaurantId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const db = getFirestore();

        if (!restaurantId) {
          console.log('No restaurant ID found.');
          setLoading(false);
          return;
        }

        const querySnapshot = await getDocs(collectionGroup(db, collectionName));

        if (!querySnapshot.empty) {
          const data = [];

          for (const doc of querySnapshot.docs) {
            const imageUrl = doc.data().restImageurl;
            const address = doc.data().address;
            const rating = doc.data().rating;
            const ratedPeople = doc.data().ratingNumber;
            const TablesubcollectionName = doc.data().subcollection;
            const docId = doc.id; // Get the ID of the current document

            if (imageUrl) {
              data.push({
                id: docId, // Include the document ID in the data
                imageUrl,
                address,
                rating,
                ratedPeople,
                TablesubcollectionName
              });
            }
          }

          setRestaurantData(data);
          setLoading(false);
        } else {
          console.log(`No documents found in the "${collectionName}" subcollection.`);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [restaurantId, collectionName]);
 
  return (
    <View style={styles.listContainer}>
      {restaurantImage ? (
        <ImageBackground source={{ uri: restaurantImage }} style={styles.imageBackground} />
      ) : (
        <Text>Loading background image...</Text>
      )}
      <FlatList
  data={restaurantData}
  renderItem={({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('ChooseTable', { restaurantId:restaurantId,restaurantName: collectionName,documentID: item.id, CollectionName: item.TablesubcollectionName })}>
      <View style={styles.itemContainer}>
        <View style={styles.itemContent}>
          <Image source={{ uri: item.imageUrl }} style={styles.image} />
          <View style={styles.detailsContainer}>
            
            <View style={styles.text}>
              <Text>{item.address}</Text>
            </View>
            {/* <View style={styles.text}>
              <Text>{item.rating}</Text>
            </View>
            <View style={styles.text}>
              <Text>{item.ratedPeople}</Text>
            </View> */}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )}
  keyExtractor={(item, index) => index.toString()}
/>

    </View>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'black'
  },
  imageBackground: {
    height: 180,
    resizeMode: "cover",
  },
  itemContainer: {
    paddingTop: 10,
    flex: 1,
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    top: 0,
  },
  image: {
    width: '50%',
    height: 100,
    resizeMode: 'cover',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  detailsContainer: {
    backgroundColor: 'white',
    padding: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: '50%',
    height: 100,
    marginRight: 20,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },
});
