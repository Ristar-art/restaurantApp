import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { setFirstName, setLastName, setEmail, setPassword, setLoading, setError, setRole } from './signUnSlice';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';
import { assignUserRole } from './userRoleSlice'; // Import your custom function for assigning roles
import firebase from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Import Firestore functions

const SignUpForm = ({ navigation }) => {
  const dispatch = useDispatch();
  const signUpData = useSelector(state => state.signUp);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'regularUser', // Default role
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

      if (userCredential) {
        dispatch(setFirstName(formData.firstName));
        dispatch(setLastName(formData.lastName));
        dispatch(setEmail(formData.email));
        dispatch(setPassword(formData.password));
        dispatch(setRole(formData.role));

        // Initialize Firestore
        const firestore = getFirestore();

        // Use the user's UID as the document ID for the 'profile' document
        const userProfileRef = doc(firestore, 'Profile', userCredential.user.uid);

        await setDoc(userProfileRef, {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          role: formData.role,
          // Other profile data you may want to store
        });

        // Assign the selected role to the user
        const roleAssigned = await assignUserRole(userCredential.user.uid, formData.role);

        if (roleAssigned) {
          navigation.navigate('Login');
        } else {
          console.error('Failed to assign user role');
          // Handle the error as needed
        }
      } else {
        console.error('User registration failed');
        // Handle the error as needed
      }
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
      <View style={{height:100}}>
        <Text style={{ fontSize: 25,fontWeight:'bold'
         }}>Welcome User</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.cardBody}>
          <Text style={styles.headerText}>Sign Up</Text>
          <View style={styles.formGroup}>
            <View style={styles.inputGroup}>
              
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
            <View style={styles.inputGroup}>
           
              <TextInput
                style={styles.input}
                placeholder="Role (admin or regularUser)"
                value={formData.role}
                onChangeText={text => handleInputChange('role', text)}
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
