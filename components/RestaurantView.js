import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput,queryRef } from 'react-native';
import {
  getFirestore,
  collectionGroup,
  query,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  setDoc, // Import setDoc from firebase to create a new document if it doesn't exist.
} from 'firebase/firestore';

import { useRoute } from '@react-navigation/native';

const RestaurantView = () => {
  const [documentData, setDocumentData] = useState([]);
  const route = useRoute();  
  const [newFieldName, setNewFieldName] = useState(''); // State to hold the new field name
  const [newFieldValue, setNewFieldValue] = useState(''); // State to hold the new field value 
  const subCollectionName = route.params?.item;
  const parentId = route.params.parentId;
  console.log('parentId is: ', parentId)
  useEffect(() => {
    const firestore = getFirestore();
    const queryRef = query(collectionGroup(firestore, subCollectionName));

    const fetchDocuments = async () => {
      try {
        const querySnapshot = await getDocs(queryRef);

        if (!querySnapshot.empty) {
          const documents = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          }));
          setDocumentData(documents);
        } else {
          console.log('No documents found in sub-collection:', subCollectionName);
        }
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };

    fetchDocuments();
  }, [subCollectionName]);

  const fetchDocuments = async () => {
    try {
      const firestore = getFirestore();
      const queryRef = query(collectionGroup(firestore, subCollectionName));

      const querySnapshot = await getDocs(queryRef);
      
      if (!querySnapshot.empty) {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setDocumentData(documents);
      } else {
        console.log('No documents found in sub-collection:', subCollectionName);
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const handleAddField = async () => {
    try {
      const firestore = getFirestore();
      const queryRef = query(collectionGroup(firestore, subCollectionName));
      const querySnapshot = await getDocs(queryRef);
  
      if (!querySnapshot.empty) {
        const documents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        
        // Loop through each document in the sub-collection
        for (const document of documents) {
          const docRef = doc(firestore,'DATA',parentId, subCollectionName, document.id);
          const docPath = docRef.path;
          console.log('Document path to update:', docPath);
        
          // Check if the document path exists without fetching data
          const docSnapshot = await getDoc(docRef);
       
          if (docSnapshot.exists()) {
            // The document path exists, proceed with updates
            console.log('the if statement is true');
            const fieldToUpdate = {};
            fieldToUpdate[newFieldName] = newFieldValue;
            console.log('newFieldName is: ', newFieldName, 'newFieldValue is: ', newFieldValue);
        
            // Update the document with the dynamic field
            await updateDoc(docRef, fieldToUpdate);
          } else {
            console.log('Document does not exist:', docPath);
          }
        }
        await fetchDocuments();
        // Clear the input fields after adding the new field
        setNewFieldName('');
        setNewFieldValue('');
  
        console.log('Field added successfully to existing documents.');
      } else {
        console.log('No documents found in sub-collection:', subCollectionName);
      }
    } catch (error) {
      console.error('Error adding field:', error);
    }
  };
  

  

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Documents in Sub-Collection: {subCollectionName}</Text>
      {documentData.map((document) => (
        <View key={document.id} style={styles.documentContainer}>
          {Object.keys(document.data).map((fieldName) => (
            <View key={fieldName} style={styles.fieldItem}>
              <Text style={styles.fieldLabel}>{fieldName}:</Text>
              <Text style={styles.fieldValue}>{document.data[fieldName]}</Text>
            </View>
          ))}
        </View>
      ))}
      <TextInput
        placeholder="New Field Name"
        value={newFieldName}
        onChangeText={setNewFieldName}
        style={styles.inputField}
      />
      <TextInput
        placeholder="New Field Value"
        value={newFieldValue}
        onChangeText={setNewFieldValue}
        style={styles.inputField}
      />
      <TouchableOpacity onPress={handleAddField} style={styles.addFieldButton}>
        <Text style={styles.addFieldButtonText}>Add New Field</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  documentContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },
  fieldItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  fieldValue: {},
  addFieldButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addFieldButtonText: {
    color: 'white', // Customize the text color
    fontWeight: 'bold',
  },
  
  
});

export default RestaurantView;
