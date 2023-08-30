import React, { useEffect } from 'react';
import { Text, View, StyleSheet, Button, Image, FlatList,TouchableOpacity } from 'react-native';
import BackgroundImage from './BackgroundImage';

export default function DeshBord({ navigation }) {
  const images = [
    'https://www.blessthismessplease.com/wp-content/uploads/2017/02/DSC_8887-2.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/california-grilled-chicken-index-647a382d5880c.jpg?crop=0.502xw:1.00xh;0.260xw,0&resize=640:*',
    'https://assets.epicurious.com/photos/566af1a508cf542b399e1457/1:1/w_775%2Cc_limit/EP_12112015_garlicsoup.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/delish-230215-everything-bagel-seasoning-004-ab-index-1677274186.jpg?crop=0.502xw:1.00xh;0.254xw,0&resize=640:*',
    'https://www.eatingwell.com/thmb/KcL1KDqSg63hwmB1I95J8NfeF6g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/4526601-ee42deb7499f47389f40b37fa15d7a31.jpg',
    'https://www.eatingwell.com/thmb/5KQlKM48xgJrQIF9JNA_RxQXbKg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/5655747-b83a57a33a5a415d8dc0bca1ebe8142f.jpg',
    'https://www.blessthismessplease.com/wp-content/uploads/2017/02/DSC_8887-2.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/california-grilled-chicken-index-647a382d5880c.jpg?crop=0.502xw:1.00xh;0.260xw,0&resize=640:*',
    'https://assets.epicurious.com/photos/566af1a508cf542b399e1457/1:1/w_775%2Cc_limit/EP_12112015_garlicsoup.jpg',
    'https://hips.hearstapps.com/hmg-prod/images/delish-230215-everything-bagel-seasoning-004-ab-index-1677274186.jpg?crop=0.502xw:1.00xh;0.254xw,0&resize=640:*',
    'https://www.eatingwell.com/thmb/KcL1KDqSg63hwmB1I95J8NfeF6g=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/4526601-ee42deb7499f47389f40b37fa15d7a31.jpg',
    'https://www.eatingwell.com/thmb/5KQlKM48xgJrQIF9JNA_RxQXbKg=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/5655747-b83a57a33a5a415d8dc0bca1ebe8142f.jpg'
  ];

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handleImagePress(item)}>
      <Image source={{ uri: item }} style={styles.starImage} />
    </TouchableOpacity>
  );
  
  return (
    <View style={styles.container}>
      <BackgroundImage />
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
     
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardContainer: {
    flex: 1,
    top: 0,
    alignItems: 'center',
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 10,
    marginBottom: 20,
    maxWidth: 400,
  },
  starImage: {
    width: 110,
    height: 100,
    resizeMode: 'contain',
    margin: 5,
    borderRadius: 5,
    padding: 20,
  },
});
  