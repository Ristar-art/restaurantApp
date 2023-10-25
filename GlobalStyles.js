import { StyleSheet, Platform } from 'react-native';

const npLBlue = 'your_blue_color'; // Define your desired blue color here

export default StyleSheet.create({
  droidSafeArea: {
    flex: 1,
    backgroundColor: npLBlue,
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
});