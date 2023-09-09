import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity,TextInput } from 'react-native';
import { getFirestore, collectionGroup, query, where, getDocs } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';

const RestaurantView = () => {
  const [documentData, setDocumentData] = useState([]);
  const route = useRoute();
  const [newField, setNewField] = useState('');

  
  const subCollectionName = route.params?.item;

  useEffect(() => {
    const firestore = getFirestore();
    const queryRef = query(
      collectionGroup(firestore, subCollectionName), // Use collectionGroup to query across all collections with the same name
      //where('parentCollection', '==', 'ParentCollectionName'), // You can add additional filters if needed
    );

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

  const handleAddField = async () => {
    try {
        const db = getFirestore();
        
        // Loop through each document in the sub-collection
        for (const document of documentData) {
          const docRef = doc(db, subCollectionName, document.id);
          
          // Update the document with the new field
          await updateDoc(docRef, {
            // Replace 'newFieldName' with the name of your new field
            newFieldName: newField,
          });
        }
    
        // Clear the input field after adding the new field
        setNewField('');
    
        console.log('Field added successfully.');
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
          <TextInput
  placeholder="New Field Value"
  value={newField}
  onChangeText={setNewField}
  style={styles.inputField}
/>
<TouchableOpacity onPress={handleAddField} style={styles.addFieldButton}>
  <Text style={styles.addFieldButtonText}>Add Field</Text>
</TouchableOpacity>

        </View>
      ))}
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
    backgroundColor: 'blue', // Customize the button's appearance
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
