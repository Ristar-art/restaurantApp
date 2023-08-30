import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import {
  initializeAuth,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'AIzaSyC_u-KagLgoEhJv1sU0frmZc3Ro9kOBhFQ',
    authDomain: 'hoteldev-cc6fc.firebaseapp.com',
    projectId: 'hoteldev-cc6fc',
    storageBucket: 'hoteldev-cc6fc.appspot.com',
    messagingSenderId: '97226513206',
    appId: '1:97226513206:web:6f37147c02c1463024b197',
    measurementId: 'G-KHF96RZTK4',
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const auth = getAuth(app);


export { app, storage, auth, onAuthStateChanged,createUserWithEmailAndPassword };
