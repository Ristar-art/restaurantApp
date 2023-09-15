import React from 'react';
import { ImageBackground, StyleSheet, View, Text } from 'react-native';

const BackgroundImage = () => {
  return (
    
         <ImageBackground
      source={{ uri: 'https://i.guim.co.uk/img/media/c956027ec764b4dabc490b4bf9993627a79f3d6c/228_436_5416_3250/master/5416.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=bc8fbc29ea344e298c44568ffd9f8ad8' }}
      style={styles.imageBackground}
    >   
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
