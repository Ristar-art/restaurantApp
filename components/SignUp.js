import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { setFirstName, setLastName, setEmail, setPassword, setLoading,setError } from './signUnSlice';
import {getAuth, createUserWithEmailAndPassword } from 'firebase/auth';


import Icon from 'react-native-vector-icons/FontAwesome';

const SignUpForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const signUpData = useSelector(state => state.signUp);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const handleSubmit = async () => {
    dispatch(setLoading(true));

    try {
        const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        formData.email,
        formData.password
      );

      
      dispatch(setFirstName(formData.firstName));
      dispatch(setLastName(formData.lastName));
      dispatch(setEmail(formData.email));
      dispatch(setPassword(formData.password));
   
      navigation.navigate('Login');
      
    } catch (error) {
      console.error('Error during registration:', error);
      dispatch(setLoading(false));
      dispatch(
        setError('An error occurred while registering. Please try again later.')
      );
    } finally {
        dispatch(setLoading(false)); 
      }
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.headerText}>Sign Up</Text>
          <View style={styles.formGroup}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputIcon}>
                <Icon name="user" size={30} color="black" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="First Name"
                value={formData.firstName}
                onChangeText={text => handleInputChange('firstName', text)}
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputIcon}>
                <Icon name="user" size={30} color="black" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                value={formData.lastName}
                onChangeText={text => handleInputChange('lastName', text)}
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputIcon}>
                <Icon name="envelope" size={30} color="black" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={formData.email}
                onChangeText={text => handleInputChange('email', text)}
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputIcon}>
                <Icon name="lock" size={30} color="black" />
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={formData.password}
                onChangeText={text => handleInputChange('password', text)}
                secureTextEntry
              />
            </View>
          </View>
          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.links}>
            <Text>
              Already have an account?{' '}
              <Text
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Log In
              </Text>
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = {
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: 300,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 20,
  },
  cardBody: {},
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  formGroup: {
    marginBottom: 15,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
  },
  signupButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginLink: {
    color: 'blue',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
};

export default SignUpForm;