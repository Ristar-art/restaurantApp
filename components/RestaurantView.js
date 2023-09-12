import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput,FlatList} from 'react-native';

import {
  getFirestore,
  collectionGroup,
  query,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
} from 'firebase/firestore';

import { useRoute } from '@react-navigation/native';

import Icon from 'react-native-vector-icons/FontAwesome';

const RestaurantView = () => {
  const [documentData, setDocumentData] = useState([]);
  const route = useRoute();
  const [newFieldName, setNewFieldName] = useState(''); // State to hold the new field name
  const [newFieldValue, setNewFieldValue] = useState(''); // State to hold the new field value
  const [selectedDocumentId, setSelectedDocumentId] = useState(null); // State to hold the selected document ID
  const [selectedFieldName, setSelectedFieldName] = useState(''); // State to hold the selected field name for editing
  const subCollectionName = route.params?.item;
  const parentId = route.params.parentId;
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(''); // State to hold the selected address

  console.log('parentId is: ', parentId);

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

  const handleAddField = async () => {
    if (!selectedDocumentId) {
      console.error('No document selected for update.');
      return;
    }

    try {
      const firestore = getFirestore();
      const docRef = doc(firestore, 'DATA', parentId, subCollectionName, selectedDocumentId);
      const docPath = docRef.path;
   

      // Check if the document path exists without fetching data
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // The document path exists, proceed with updates
        console.log('The document exists.');
        const fieldToUpdate = {};
        fieldToUpdate[newFieldName] = newFieldValue;
        console.log('newFieldName is: ', newFieldName, 'newFieldValue is: ', newFieldValue);

        // Update the document with the dynamic field
        await updateDoc(docRef, fieldToUpdate);

        // Refresh the document list after updating
        await fetchDocuments();

        // Clear the input fields after adding the new field
        setNewFieldName('');
        setNewFieldValue('');

        console.log('Field added successfully to the document.');
      } else {
        console.log('Document does not exist:', docPath);
      }
    } catch (error) {
      console.error('Error adding field:', error);
    }
  };

  const handleEditField = async () => {
    if (!selectedDocumentId || !selectedFieldName) {
      console.error('No document or field selected for edit.');
      return;
    }

    try {
      const firestore = getFirestore();
      const docRef = doc(firestore, 'DATA', parentId, subCollectionName, selectedDocumentId);
      const docPath = docRef.path;
   

      // Check if the document path exists without fetching data
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // The document path exists, proceed with updates
        console.log('The document exists.');
        const fieldToUpdate = {};
        fieldToUpdate[selectedFieldName] = newFieldValue; // Update the field with the new value
        console.log('Editing field:', selectedFieldName, 'with new value:', newFieldValue);

        // Update the document with the edited field
        await updateDoc(docRef, fieldToUpdate);

        // Refresh the document list after editing
        await fetchDocuments();

        // Clear the input fields after editing the field
        setSelectedFieldName('');
        setNewFieldValue('');

        console.log('Field edited successfully.');
      } else {
        console.log('Document does not exist:', docPath);
      }
    } catch (error) {
      console.error('Error editing field:', error);
    }
  };

  const handleCreateNewDocument = async () => { 
    setShowAddressDropdown(true);  
};


  const handleAddressSelection = async () => {
    try {
      const firestore = getFirestore();
  
      // Check if a valid address is selected
      if (selectedAddress) {
        // Construct a reference to the sub-collection
        const subCollectionRef = collection(firestore, 'DATA', parentId, subCollectionName);
  
        // Add a new document to the sub-collection with an auto-generated ID and the selected address
        const newDocRef = await addDoc(subCollectionRef, {
          address: selectedAddress,
          name: subCollectionName,
        });
  
        console.log('New document created successfully with ID:', newDocRef.id);
        const subcollectionRef = collection(newDocRef,  selectedAddress);
  
      // // // Automatically generate an ID for the document under subCollectionRef
        await addDoc(subcollectionRef, {
      // //   // You can add any fields here
          address: selectedAddress,
        });
        await fetchDocuments();
  
        // Hide the address dropdown
        setShowAddressDropdown(false);
      } else {
        console.error('Invalid address selected.');
      }
    } catch (error) {
      console.error('Error creating a new document:', error);
    }
  };

  
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

  const handleDeleteDocument = async (documentId) => {
    try {
      const firestore = getFirestore();
      const docRef = doc(firestore, 'DATA', parentId, subCollectionName, documentId);

      // Delete the document
      await deleteDoc(docRef);

      console.log('Document deleted successfully:', documentId);
      await fetchDocuments(); // Refresh the document list after deletion
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };

  const handleDeleteField = async (documentId, fieldNameToDelete) => {
    if (!documentId) {
      console.error('No document selected for field deletion.');
      return;
    }

    try {
      const firestore = getFirestore();
      const docRef = doc(firestore, 'DATA', parentId, subCollectionName, documentId);

      // Fetch the document to get its current data
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data[fieldNameToDelete] !== undefined) {
          // Remove the field from the document
          delete data[fieldNameToDelete];

          // Update the document with the modified data
          await setDoc(docRef, data);

          console.log(`Field "${fieldNameToDelete}" deleted successfully from document:`, documentId);
          await fetchDocuments(); // Refresh the document list after field deletion
        } else {
          console.log(`Field "${fieldNameToDelete}" does not exist in document:`, documentId);
        }
      } else {
        console.log('Document does not exist:', documentId);
      }
    } catch (error) {
      console.error('Error deleting field:', error);
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
              {fieldName === selectedFieldName ? ( // Render input field for editing
                <TextInput
                  style={styles.fieldInput}
                  value={newFieldValue}
                  onChangeText={setNewFieldValue}
                  placeholder={`Edit ${fieldName}`}
                />
              ) : (
                <Text style={styles.fieldValue}>{document.data[fieldName]}</Text>
              )}
              {fieldName !== selectedFieldName && ( // Render "Edit Field" button for non-selected fields
                <TouchableOpacity
                  onPress={() => {
                    setSelectedDocumentId(document.id);
                    setSelectedFieldName(fieldName);
                    setNewFieldValue(document.data[fieldName]);
                  }}
                  style={styles.editFieldButton}
                >
                  <Text style={styles.editFieldButtonText}>Edit Field</Text>
                </TouchableOpacity>
              )}
              {fieldName === selectedFieldName && ( // Render "Save" button for selected field
                <TouchableOpacity onPress={handleEditField} style={styles.saveFieldButton}>
                  <Text style={styles.saveFieldButtonText}>Save</Text>
                </TouchableOpacity>
              )}
              {fieldName === selectedFieldName && ( // Render "Cancel" button for selected field
                <TouchableOpacity
                  onPress={() => {
                    setSelectedFieldName('');
                    setNewFieldValue('');
                  }}
                  style={styles.cancelFieldButton}
                >
                  <Text style={styles.cancelFieldButtonText}>Cancel</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => handleDeleteField(document.id, fieldName)}
                style={styles.deleteFieldButton}
              >
                <Text style={styles.deleteFieldButtonText}>Delete Field</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => handleDeleteDocument(document.id)}
            style={styles.deleteDocumentButton}
          >
            <Text style={styles.deleteDocumentButtonText}>Delete Document</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedDocumentId(document.id)}
            style={styles.selectDocumentButton}
          >
            <Text style={styles.selectDocumentButtonText}>Select Document</Text>
          </TouchableOpacity>
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

      {/* Create a new document button */}
      <TouchableOpacity onPress={handleCreateNewDocument} style={styles.createNewDocumentButton}>
        <Text style={styles.createNewDocumentButtonText}>Create New Document</Text>
      </TouchableOpacity>

      {showAddressDropdown ? (
    <View style={styles.addressDropdownContainer}>
      <Text style={styles.fieldLabel}>Address:</Text>
      
      <TextInput 
          placeholder="Select an address"
          value={selectedAddress}
          onChangeText={(text) => setSelectedAddress(text)} // Update this line
          style={styles.addressDropdown}
       />
      <TouchableOpacity onPress={handleAddressSelection} style={styles.addressSelectionButton}>
        <Text style={styles.addressSelectionButtonText}>Create Document</Text>
      </TouchableOpacity>
    </View>
  ) : (
    <Icon name="star" size={10} color="gold" />
  )}
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
  fieldInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 5,
    borderRadius: 5,
  },
  editFieldButton: {
    backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  editFieldButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  saveFieldButton: {
    backgroundColor: 'green',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  saveFieldButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  cancelFieldButton: {
    backgroundColor: 'red',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  cancelFieldButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteFieldButton: {
    backgroundColor: 'purple',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: 'center',
  },
  deleteFieldButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  deleteDocumentButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  deleteDocumentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  inputField: {
    borderWidth: 1,
    borderColor: 'lightgray',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  addFieldButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addFieldButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  createNewDocumentButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  createNewDocumentButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  addressDropdownContainer: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  addressDropdown: {
    borderWidth: 1,
    borderColor: 'lightgray',
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  addressSelectionButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  addressSelectionButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectDocumentButton: {
    backgroundColor: 'orange', // Customize the select button's style
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  selectDocumentButtonText: {
    color: 'white', // Customize the text color
    fontWeight: 'bold',
  },
  
});

export default RestaurantView;
