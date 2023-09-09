import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image  } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { setIsLoggedIn, setIsLoading } from '../authSlice';
import BackgroundImage from './BackgroundImage';
import { auth } from '../firebaseConfig';
import Icon from 'react-native-vector-icons/FontAwesome';
import Datepicker from './Datepicker';
export default function Home({ navigation }) {
  const dispatch = useDispatch();
  const { isLoggedIn, isLoading } = useSelector(state => state.auth);

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
  console.log('logged in?', isLoggedIn);
  const images = [
    'https://www.blessthismessplease.com/wp-content/uploads/2017/02/DSC_8887-2.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/california-grilled-chicken-index-647a382d5880c.jpg?crop=0.502xw:1.00xh;0.260xw,0&resize=640:*',
    'https://assets.epicurious.com/photos/566af1a508cf542b399e1457/1:1/w_775%2Cc_limit/EP_12112015_garlicsoup.jpg',
    
  ];

  return (
    <View style={styles.container}>
      <BackgroundImage />
      
      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardText}>The last Supper</Text>
           <View style={styles.smallerText}>
           <Text style={styles.cardExplanation}>Eat my flesh, and drink my blood.</Text>
          <Text style={styles.cardExplanation}>The words that i speak to you, they are spirt and they are life.</Text>
           </View>
            <View style={styles.starsContainer}>
            <Icon name="star" size={10} color="gold" />
            <Icon name="star" size={10} color="gold" />
            <Icon name="star" size={10} color="gold" />
            <Icon name="star" size={10} color="gold" />
            <Icon name="star" size={10} color="gold" />
            <Text style={styles.cardExplanation}>6000</Text>
          </View>
          <Icon name="user" size={60} color="black" />
          
           
        </View>
        
      </View>
      <View style={styles.cardContainer2}>
        <View style={styles.card}>
           
            <View style={styles.starsContainer}>
               {images.map((image, index) => (
                <Image
                key={index}
                source={{ uri: image }}
                style={styles.starImage}
              />
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
              <Icon name="star" size={60} color="gray" onPress={() => navigation.navigate('admin') } />
              </View>
              <View style={styles.spaceBetween}>
              <Icon name="user" size={60} color="gray" onPress={() => navigation.navigate('Login') }/>
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
   
   // justifyContent: 'center',
    alignItems: 'center',
    //backgroundColor: 'brown',
    maxWidth:350,
   
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
    top:0,
    
  },
  smallerText:{
    marginBottom:10,
   // backgroundColor:'yellow'
  },

  cardExplanation:{
    fontSize: 12,
    
    top:0,
  }, starsContainer: {
    flexDirection: 'row', 
    alignItems: 'center', 
  },
  spaceBetween:{
    padding: 20
  },
  starImage: {
    width: 110,
    height: 100,
    resizeMode: 'contain',
  },
});
