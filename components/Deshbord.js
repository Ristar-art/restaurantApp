import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  FlatList,
  ImageBackground,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { setIsLoggedIn, setIsLoading } from "../authSlice";

import { auth } from "../firebaseConfig";

import { getFirestore, collection, getDocs } from "firebase/firestore";

import "firebase/firestore";

function isURL(str) {
  const pattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
  return pattern.test(str);
}

export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector((state) => state.auth);
  const userRole = useSelector((state) => state.userRole);

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const db = getFirestore();
    const dataRef = collection(db, "DATA");

    getDocs(dataRef)
      .then((snapshot) => {
        if (!snapshot.empty) {
          const validRestaurants = snapshot.docs.filter((doc) => {
            const imageUrl = doc.data().imageurl;
            return imageUrl && isURL(imageUrl); // Check if imageurl is present and a valid URL
          });

          setRestaurants(validRestaurants);
        } else {
          console.log("Firestore collection is empty.");
        }
      })
      .catch((error) => {
        console.error("Error retrieving data from Firestore:", error);
      })
      .finally(() => {
        setLoading(false); // Mark loading as complete
      });
  }, []);

  const handleRestaurantPress = (restaurantId, collectionName) => {
    navigation.navigate("RestaurantsDisplay", { restaurantId, collectionName });
  };
  const handleImagePress = (item) => {
    if (item && item.data) {
     
      handleRestaurantPress(item.id, item.data().subCollection);
    }
  };
  
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      dispatch(setIsLoggedIn(!!user));
      dispatch(setIsLoading(false));
    });

    signOut(auth);

    return () => unsubscribe();
  }, [dispatch]);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://i.guim.co.uk/img/media/c956027ec764b4dabc490b4bf9993627a79f3d6c/228_436_5416_3250/master/5416.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=bc8fbc29ea344e298c44568ffd9f8ad8",
        }}
        style={styles.imageBackground}
      ></ImageBackground>

      <View style={styles.TotalPirceAndTaxes}>
        <View style={styles.subtotal}>
          <Text style={styles.subtotal}>Populer Restaurents</Text>
        </View>
        <View style={styles.taxes}>
          <TouchableOpacity onPress={() => navigation.navigate("deshbord")}>
            <Text style={styles.subtotal}>View more</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.cardContainer}>
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
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  imageBackground: {
    height: 180,
    resizeMode: "cover",
  },
  subtotal: {
    color: "white",
  },
  cardContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "black",
    justifyContent: "space-between",
    alignItems: "center",
  },
  profile: {
    position: "absolute",
    top: 0,
    left: 280,
    zIndex: 2,
    backgroundColor: "brown",
    width: 70,
    height: 70,
    alignItems: "center",
    borderRadius: 50,
  },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    fontSize: 18,
    fontWeight: "bold",
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
    flexDirection: "row",
    alignItems: "center",
  },
  spaceBetween: {
    padding: 20,
  },
  starImage: {
    width: 110,
    height: 100,
    resizeMode: "contain",
  },
  TotalPirceAndTaxes: {
    height: 50,
    width: "100%",
    backgroundColor: "black",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 70,
    alignItems: "center",
  },

  // Add your other styles here
});

{
  /* <View style={styles.card}>
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
          
        </View> */
}

//   <View style={styles.cardContainer2}>
//   <View style={styles.card}>
//     <View style={styles.starsContainer}>
//       {images.map((image, index) => (
//         <TouchableOpacity key={index} onPress={() => navigation.navigate('deshbord')}>
//           <Image source={{ uri: image }} style={styles.starImage} />
//         </TouchableOpacity>
//       ))}
//     </View>
//   </View>
// </View>

{
  /* <View style={styles.starsContainer}>
<View style={styles.spaceBetween}>
  <Icon name="home" size={60} color="white" />
</View>
<View style={styles.spaceBetween}>
  <Icon name="globe" size={60} color="gold" />
</View>
<View style={styles.spaceBetween}>
  <Icon name="star" size={60} color="gray"  />
</View>
<View style={styles.spaceBetween}>
  <Icon name="user" size={60} color="gray" onPress={() => navigation.navigate('profile')} />
</View>
</View> */
}
