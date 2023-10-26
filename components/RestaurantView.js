import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from "react-native";

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
} from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../firebaseConfig";

import { useRoute } from "@react-navigation/native";

import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native"; // Import navigation hooks
import Ionicons from "@expo/vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
const RestaurantView = () => {
  const [documentData, setDocumentData] = useState([]);
  const route = useRoute();
  const [newFieldName, setNewFieldName] = useState(""); // State to hold the new field name
  const [newFieldValue, setNewFieldValue] = useState(""); // State to hold the new field value
  const [selectedDocumentId, setSelectedDocumentId] = useState(null); // State to hold the selected document ID
  const [selectedFieldName, setSelectedFieldName] = useState(""); // State to hold the selected field name for editing
  const subCollectionName = route.params?.item;
  const parentId = route.params.parentId;
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showAddFieldDropdown, setShowAddFieldDropdown] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectTable, setSelectTable] = useState("");
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    (async () => {
      if (Platform.OS !== "web") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work.");
        }
      }
    })();
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.cancelled) {
        const imageUri = result.uri;
        const imageRef = ref(storage, "images/" + result.uri);
        const imageSnapshot = await uploadBytes(imageRef, imageUri);
        const imageUrl = await getDownloadURL(imageSnapshot.ref);

        setImage(imageUrl);
      }
    } catch (error) {
      console.error("Error picking an image:", error);
    }
  };

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
          console.log(
            "No documents found in sub-collection:",
            subCollectionName
          );
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [subCollectionName]);

  const handleAddFieldDropdown = async () => {
    setShowAddFieldDropdown(true);
  };

  const handleAddField = async () => {
    if (!selectedDocumentId) {
      console.error("No document selected for update.");
      return;
    }

    try {
      const firestore = getFirestore();
      const docRef = doc(
        firestore,
        "DATA",
        parentId,
        subCollectionName,
        selectedDocumentId
      );
      const docPath = docRef.path;

      // Check if the document path exists without fetching data
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // The document path exists, proceed with updates
        console.log("The document exists.");
        const fieldToUpdate = {};
        fieldToUpdate[newFieldName] = newFieldValue;
        console.log(
          "newFieldName is: ",
          newFieldName,
          "newFieldValue is: ",
          newFieldValue
        );

        // Update the document with the dynamic field
        await updateDoc(docRef, fieldToUpdate);

        // Refresh the document list after updating
        await fetchDocuments();

        // Clear the input fields after adding the new field
        setNewFieldName("");
        setNewFieldValue("");

        console.log("Field added successfully to the document.");
        setShowAddFieldDropdown(false);
      } else {
        console.log("Document does not exist:", docPath);
      }
    } catch (error) {
      console.error("Error adding field:", error);
    }
  };

  const handleEditField = async () => {
    if (!selectedDocumentId || !selectedFieldName) {
      console.error("No document or field selected for edit.");
      return;
    }

    try {
      const firestore = getFirestore();
      const docRef = doc(
        firestore,
        "DATA",
        parentId,
        subCollectionName,
        selectedDocumentId
      );
      const docPath = docRef.path;

      // Check if the document path exists without fetching data
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // The document path exists, proceed with updates
        console.log("The document exists.");
        const fieldToUpdate = {};
        fieldToUpdate[selectedFieldName] = newFieldValue; // Update the field with the new value
        console.log(
          "Editing field:",
          selectedFieldName,
          "with new value:",
          newFieldValue
        );

        // Update the document with the edited field
        await updateDoc(docRef, fieldToUpdate);

        // Refresh the document list after editing
        await fetchDocuments();

        // Clear the input fields after editing the field
        setSelectedFieldName("");
        setNewFieldValue("");

        console.log("Field edited successfully.");
      } else {
        console.log("Document does not exist:", docPath);
      }
    } catch (error) {
      console.error("Error editing field:", error);
    }
  };

  const handleCreateNewDocument = async () => {
    setShowAddressDropdown(true);
  };

  const handleAddressSelection = async () => {
    try {
      const firestore = getFirestore();

      // Check if a valid address is selected
      if (selectedAddress && selectTable) {
        // Construct a reference to the sub-collection
        const subCollectionRef = collection(
          firestore,
          "DATA",
          parentId,
          subCollectionName
        );

        // Add a new document to the sub-collection with an auto-generated ID and the selected address
        const newDocRef = await addDoc(subCollectionRef, {
          address: selectTable,
          name: subCollectionName,
          subcollection: selectedAddress,
        });

        console.log("New document created successfully with ID:", newDocRef.id);
        const subcollectionRef = collection(newDocRef, selectedAddress);

        // Automatically generate an ID for the document under subCollectionRef
        await addDoc(subcollectionRef, {
          // You can add any fields here
          address: selectTable,
        });
        await fetchDocuments();

        // Hide the address dropdown
        setShowAddressDropdown(false);
      } else {
        console.error("Invalid address selected.");
      }
    } catch (error) {
      console.error("Error creating a new document:", error);
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
        console.log("No documents found in sub-collection:", subCollectionName);
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const handleDeleteDocument = async (documentId) => {
    try {
      const firestore = getFirestore();
      const docRef = doc(
        firestore,
        "DATA",
        parentId,
        subCollectionName,
        documentId
      );

      // Delete the document
      await deleteDoc(docRef);

      console.log("Document deleted successfully:", documentId);
      await fetchDocuments(); // Refresh the document list after deletion
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const handleDeleteField = async (documentId, fieldNameToDelete) => {
    if (!documentId) {
      console.error("No document selected for field deletion.");
      return;
    }

    try {
      const firestore = getFirestore();
      const docRef = doc(
        firestore,
        "DATA",
        parentId,
        subCollectionName,
        documentId
      );

      // Fetch the document to get its current data
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        if (data && data[fieldNameToDelete] !== undefined) {
          // Remove the field from the document
          delete data[fieldNameToDelete];

          // Update the document with the modified data
          await setDoc(docRef, data);

          console.log(
            `Field "${fieldNameToDelete}" deleted successfully from document:`,
            documentId
          );
          await fetchDocuments(); // Refresh the document list after field deletion
        } else {
          console.log(
            `Field "${fieldNameToDelete}" does not exist in document:`,
            documentId
          );
        }
      } else {
        console.log("Document does not exist:", documentId);
      }
    } catch (error) {
      console.error("Error deleting field:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}> {subCollectionName} Restaurents</Text>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={documentData} // Pass your document data to the FlatList
        keyExtractor={(item) => item.id} // Specify a unique key for each item
        renderItem={({ item }) => (
          <View key={item.id} style={styles.documentContainer}>
            {Object.keys(item.data).map((fieldName) => (
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
                  <Text style={styles.fieldValue}>{item.data[fieldName]}</Text>
                )}
                {fieldName !== selectedFieldName && ( // Render "Edit Field" button for non-selected fields
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedDocumentId(item.id);
                      setSelectedFieldName(fieldName);
                      setNewFieldValue(item.data[fieldName]);
                    }}
                    style={styles.editFieldButton}
                  >
                    <AntDesign name="edit" size={24} color="black" />
                    {/* <Text style={styles.editFieldButtonText}>Edit Field</Text> */}
                  </TouchableOpacity>
                )}
                {fieldName === selectedFieldName && ( // Render "Save" button for selected field
                  <TouchableOpacity
                    onPress={handleEditField}
                    style={styles.saveFieldButton}
                  >
                    <Text style={styles.saveFieldButtonText}>Save</Text>
                  </TouchableOpacity>
                )}
                {fieldName === selectedFieldName && ( // Render "Cancel" button for selected field
                  <TouchableOpacity
                    onPress={() => {
                      setSelectedFieldName("");
                      setNewFieldValue("");
                    }}
                    style={styles.cancelFieldButton}
                  >
                    <Text style={styles.cancelFieldButtonText}>Cancel</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => handleDeleteField(item.id, fieldName)}
                  style={styles.deleteFieldButton}
                >
                  <AntDesign name="delete" size={24} color="black" />
                  {/* <Text style={styles.deleteFieldButtonText}>Delete Field</Text> */}
                </TouchableOpacity>
              </View>
            ))}
            <TouchableOpacity
              onPress={() => handleDeleteDocument(item.id)}
              style={styles.deleteDocumentButton}
            >
              <AntDesign name="delete" size={24} color="black" />
              <Text style={styles.deleteDocumentButtonText}>
                Delete Document
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedDocumentId(item.id)}
              style={styles.selectDocumentButton}
            >
              <AntDesign name="select1" size={24} color="black" />
              <Text style={styles.selectDocumentButtonText}>
                Select Document
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("table", {
                  TableData: item.data,
                  parentId,
                  subCollectionName,
                  documentId: item.id,
                });
              }}
              style={styles.selectDocumentButton}
            >
              <MaterialIcons name="preview" size={24} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />
      {showAddFieldDropdown ? (
        <View style={styles.addressDropdownContainer}>
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
          <TouchableOpacity
            onPress={handleAddField}
            style={styles.addFieldButton}
          >
            <Text style={styles.addFieldButtonText}>
              Select the doc and Add the Field
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleAddFieldDropdown}
          style={styles.addFieldButton}
        >
          <AntDesign name="addfile" size={24} color="black" />
          <Text style={styles.addFieldButtonText}>Add New Field</Text>
        </TouchableOpacity>
      )}

      {showAddressDropdown ? (
        <View style={styles.addressDropdownContainer}>
          <Text style={styles.fieldLabel}>Address:</Text>

          <TextInput
            placeholder="Select an address"
            value={selectedAddress}
            onChangeText={(text) => setSelectedAddress(text)} // Update this line
            style={styles.addressDropdown}
          />
          <TextInput
            placeholder="Select a table"
            value={selectTable}
            onChangeText={(text) => setSelectTable(text)} // Update this line
            style={styles.addressDropdown}
          />
          <TouchableOpacity
            onPress={handleAddressSelection}
            style={styles.addressSelectionButton}
          >
            <AntDesign name="addfolder" size={24} color="black" />
            <Text style={styles.addressSelectionButtonText}>
              Create Document
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleCreateNewDocument}
          style={styles.createNewDocumentButton}
        >
          <AntDesign name="addfolder" size={24} color="black" />
          <Text style={styles.createNewDocumentButtonText}>
            Create New Document
          </Text>
        </TouchableOpacity>
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
    fontWeight: "bold",
    marginBottom: 10,
  },
  documentContainer: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 10,
    borderRadius: 5,
    backgroundColor:'gray'
  },
  fieldItem: {
  flex:1,
    marginBottom: 8,
    // backgroundColor:'green',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  fieldLabel: {
    fontWeight: "bold",
    marginRight: 5,
    
    // backgroundColor: 'blue',
  },
  fieldValue: {
    flex: 1,
    borderWidth: 1,
    borderColor: "lightgray",
    padding:5,
    borderRadius: 5,
    // backgroundColor: 'blue',
  },
  fieldInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "lightgray",
    padding:5,
    borderRadius: 5,
    // backgroundColor: 'blue',
   
  },
  editFieldButton: {
    // backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: "center",

  },
  editFieldButtonText: {
    color: "white",
    fontWeight: "bold",
    // backgroundColor: 'blue',
  },
  saveFieldButton: {
    // backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  saveFieldButtonText: {
    color: "white",
    fontWeight: "bold",
    // backgroundColor: 'blue',
  },
  cancelFieldButton: {
    // backgroundColor: 'blue',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: "center",

  },
  cancelFieldButtonText: {
    color: "white",
    fontWeight: "bold",
    // backgroundColor: 'blue',
  },
  deleteFieldButton: {
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: "center",
    
  },
  deleteFieldButtonText: {
    color: "white",
    fontWeight: "bold",
    // backgroundColor: 'blue',
  },
  deleteDocumentButton: {
    // backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: 'blue',
  },
  deleteDocumentButtonText: {
    color: "white",
    fontWeight: "bold",
    // backgroundColor: 'blue',
  },
  inputField: {
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    // backgroundColor: 'blue',
  },
  addFieldButton: {
    backgroundColor: 'blue',
    // backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  addFieldButtonText: {
    color: "white",
    fontWeight: "bold",
    backgroundColor: 'blue',
  },
  createNewDocumentButton: {
    backgroundColor: 'blue',
    // backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  createNewDocumentButtonText: {
    color: "white",
    fontWeight: "bold",
    backgroundColor: 'blue'
  },
  addressDropdownContainer: {
    marginBottom: 8,
    // backgroundColor: 'blue'
  },
  fieldLabel: {
    fontWeight: "bold",
    marginRight: 5,
    // backgroundColor: 'red',
    width:'31%'
  },
  addressDropdown: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
    // backgroundColor: 'red'
  },
  addressSelectionButton: {
    backgroundColor: 'blue',
    // backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  addressSelectionButtonText: {
    color: "white",
    fontWeight: "bold",
    // backgroundColor: 'red'
  },
  selectDocumentButton: {
    // backgroundColor: "transparent", // Customize the select button's style
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    backgroundColor: 'blue'
  },
  selectDocumentButtonText: {
    color: "white", // Customize the text color
    fontWeight: "bold",
    // backgroundColor: 'red'
  },
});

export default RestaurantView;
