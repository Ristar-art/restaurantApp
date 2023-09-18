import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore, doc, setDoc } from 'firebase/firestore';

import {
  initializeAuth,
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
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

initializeApp(firebaseConfig);
const storage = getStorage();
const auth = getAuth();

export {
  storage,
  auth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  getFirestore,
  doc,
  setDoc,
};
