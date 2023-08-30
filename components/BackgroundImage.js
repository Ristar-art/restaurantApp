import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';

const BackgroundImage = () => {
  return (
    
         <ImageBackground
      source={{ uri: 'https://img.freepik.com/premium-photo/last-supper-painting-by-christian-art_888396-3076.jpg' }}
      style={styles.imageBackground}
    >
     {/* <View style={styles.overlay}>
        <Text style={styles.welcomeText}>Welcome to the My Resrurant!</Text>
      </View> */}
    </ImageBackground>
 
   
  );
};

const styles = StyleSheet.create({
  imageBackground: {
    flex: 1,
    resizeMode: 'cover',
    height:200
    
  },
  overlay: {
    position: 'absolute', // Position the card container absolutely
    top: 240,               // Position it at the top of the screen
    left: 0,
    right: 0,
    bottom: 0,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.0)', // Add a semi-transparent black overlay
    //justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2, // Ensure the overlay is above the background image
  },
  welcomeText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  
});

export default BackgroundImage;
