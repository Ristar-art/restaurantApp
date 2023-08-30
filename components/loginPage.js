import { useDispatch, useSelector } from 'react-redux';
import { setIsLoggedIn, setEmail, setPassword, setLoading, setError } from './customAuthSilce';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {auth } from '../firebaseConfig';
import {signInWithEmailAndPassword } from 'firebase/auth';
import { getIdToken } from 'firebase/auth';

const LoginPage = ({ navigation }) => {
  const email = useSelector((state) => state.customAuth.email);
  const password = useSelector((state) => state.customAuth.password);
  const loading = useSelector((state) => state.customAuth.isLoading);
  const error = useSelector((state) => state.customAuth.error); 
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector(state => state.customAuth);

  const handleSubmit = async () => {
    dispatch(setLoading(true));
    
    dispatch(setIsLoggedIn(true));
    try {
        
      await signInWithEmailAndPassword(auth, email, password);
      
      const user = auth.currentUser;
   
      if (user) {
        const token = await getIdToken(user); 
        navigation.navigate('deshbord');       
      }
    } catch (error) {
      console.error('Error during login:', error);
      alert('An error occurred while logging in. Please try again later.');
      dispatch(setError(error.message));
    } finally {
      dispatch(setLoading(false));

    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.headerText}>Sign In</Text>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.formGroup}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputIcon}>
                <Icon name="key" size={30} color="black" />
              </Text>
              <TextInput
  style={styles.input}
  placeholder="email"
  value={email}
  onChangeText={(value) => {
    
    dispatch(setEmail(value))}}
/>

            </View>
          </View>
          <View style={styles.formGroup}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputIcon}>
                <Icon name="key" size={30} color="black" />
              </Text>
              <TextInput
  style={styles.input}
  placeholder="Password"
  value={password}
  onChangeText={(value) => {
    
    dispatch(setPassword(value))}}
  secureTextEntry={true}
/>
            </View>
          </View>

          <View style={styles.formGroup}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.links}>
            <Text>
              Don't have an account?
              <Text
                style={styles.signUpLink}
                onPress={() => navigation.navigate('Signup')}
              >
                Sign Up
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
  cardHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  socialIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '50%',
  },
  cardBody: {},
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
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  checkbox: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  loginButton: {
    backgroundColor: '#007bff',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  cardFooter: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingTop: 20,
    marginTop: 20,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  signUpLink: {
    color: 'blue',
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
};

export default LoginPage;
