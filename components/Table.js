// DocumentDetailsScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
} from "react-native";

import {
  getFirestore,
  collectionGroup,
  query,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  setDoc,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

import { useRoute } from "@react-navigation/native";

import Icon from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native"; // Import navigation hooks
import { AntDesign } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
const TableScreen = () => {
  const route = useRoute();

  // Retrieve the data passed from the previous screen
  const TableData = route.params?.TableData;
  const documentId = route.params?.documentId;
  console.log("documentId is: ", documentId);
  const parentId = route.params?.parentId;
  const subCollectionName = route.params?.subCollectionName;
  const parentSelectedDocumentId = documentId;
  console.log("TableData is: ", TableData);
  console.log("parentSelectedDocumentId is: ", parentSelectedDocumentId);
  const tablecollectioName = TableData.subcollection;
  console.log("tablecollectioName is: ", tablecollectioName);
  const [documentData, setDocumentData] = useState([]);
  const [selectCapacity, setSelectCapacity] = useState("");
  const [newFieldName, setNewFieldName] = useState(""); // State to hold the new field name
  const [newFieldValue, setNewFieldValue] = useState(""); // State to hold the new field value
  const [selectedDocumentId, setSelectedDocumentId] = useState(null); // State to hold the selected document ID
  const [selectedFieldName, setSelectedFieldName] = useState(""); // State to hold the selected field name for editing
  const [showAddressDropdown, setShowAddressDropdown] = useState(false);
  const [showAddFieldDropdown, setShowAddFieldDropdown] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(""); // State to hold the selected address
  const [selectTable, setSelectTable] = useState("");
  

  useEffect(() => {
    const firestore = getFirestore();
    const queryRef = query(collectionGroup(firestore, tablecollectioName));

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
            tablecollectioName
          );
        }
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocuments();
  }, [tablecollectioName]);
  const handleAddFieldDropdown = async () => {
    setShowAddFieldDropdown(true);
  };

  const handleAddField = async () => {
    console.log("selectedDocumentId is: ", selectedDocumentId);
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
        parentSelectedDocumentId,
        tablecollectioName,
        selectedDocumentId
      );
      const docPath = docRef.path;
      console.log("docPath is: ", docPath);
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
  
    if (selectedFieldName === "restImageUrl") {
      console.error("Editing restImageUrl field is not allowed.");
      return;
    }
  
    try {
      const firestore = getFirestore();
      const docRef = doc(
        firestore,
        "DATA",
        parentId,
        subCollectionName,
        parentSelectedDocumentId,
        tablecollectioName,
        selectedDocumentId
      );
      const docPath = docRef.path;
  
      // Check if the document path exists without fetching data
      const docSnapshot = await getDoc(docRef);
      console.log("docSnapshot is: ", docSnapshot);
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

  const handleAddTable = async () => {
    try {
      const firestore = getFirestore();

      // Check if a valid address is selected
      if (selectedAddress && selectTable) {
        // Construct a reference to the sub-collection
        const subCollectionRef = collection(
          firestore,
          "DATA",
          parentId,
          subCollectionName,
          parentSelectedDocumentId,
          tablecollectioName
        );

        // Add a new document to the sub-collection with an auto-generated ID and the selected address
        const newDocRef = await addDoc(subCollectionRef, {
          address: selectedAddress,
          available: true,
          table: selectTable,
          Capacity:selectCapacity


        });

        console.log("New document created successfully with ID:", newDocRef.id);

        await fetchDocuments();
      } else {
        console.error("Invalid address selected.");
      }
    } catch (error) {
      console.error("Error creating a new document:", error);
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
        parentSelectedDocumentId,
        tablecollectioName,
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
  

  const fetchDocuments = async () => {
    try {
      const firestore = getFirestore();
      const queryRef = query(collectionGroup(firestore, tablecollectioName));

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
          tablecollectioName
        );
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
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
        parentSelectedDocumentId,
        tablecollectioName,
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
      <Text style={styles.header}>{subCollectionName} Tables</Text>
      <FlatList
        data={documentData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View key={item.id} style={styles.documentContainer}>
            {Object.keys(item.data).map((fieldName) => (
              <React.Fragment key={fieldName}>
                {fieldName !== "restImageUrl" && (
                  <>
                    <Text style={styles.fieldLabel}>{fieldName}:</Text>
                    {fieldName === selectedFieldName && (
                      <TextInput
                        style={styles.fieldInput}
                        value={newFieldValue}
                        onChangeText={setNewFieldValue}
                        placeholder={`Edit ${fieldName}`}
                      />
                    )}
                    {fieldName !== selectedFieldName && (
                      <Text style={styles.fieldValue}>
                        {item.data[fieldName]}
                      </Text>
                    )}
                    {fieldName !== selectedFieldName && (
                      <TouchableOpacity
                        onPress={() => {
                          setSelectedDocumentId(item.id);
                          setSelectedFieldName(fieldName);
                          setNewFieldValue(item.data[fieldName]);
                        }}
                        style={styles.editFieldButton}
                      >
                        <AntDesign name="edit" size={24} color="black" />
                      </TouchableOpacity>
                    )}
                    {fieldName === selectedFieldName && (
                      <TouchableOpacity
                        onPress={handleEditField}
                        style={styles.saveFieldButton}
                      >
                        <Text style={styles.saveFieldButtonText}>Save</Text>
                      </TouchableOpacity>
                    )}
                    {fieldName === selectedFieldName && (
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
                    {fieldName !== "restImageUrl" && (
                      <TouchableOpacity
                        onPress={() => handleDeleteField(item.id, fieldName)}
                        style={styles.deleteFieldButton}
                      >
                        <AntDesign name="delete" size={24} color="black" />
                      </TouchableOpacity>
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
            <TouchableOpacity
              onPress={() => handleDeleteDocument(item.id)}
              style={styles.deleteDocumentButton}
            >
              <AntDesign name="delete" size={24} color="black" />
              <Text style={styles.deleteDocumentButtonText}>Delete Table</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setSelectedDocumentId(item.id)}
              style={styles.selectDocumentButton}
            >
              <AntDesign name="select1" size={24} color="black" />
              <Text style={styles.selectDocumentButtonText}>Select Table</Text>
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
              Select the table and Add the Field
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          onPress={handleAddFieldDropdown}
          style={styles.addFieldButton}
        >
          <AntDesign name="addfile" size={24} color="black" />
          <Text style={styles.addFieldButtonText}>Add A Field</Text>
        </TouchableOpacity>
      )}

      {showAddressDropdown ? (
        <View style={styles.addressDropdownContainer}>
          <Text style={styles.fieldLabel}>Address:</Text>

          <TextInput
            placeholder="Select an address"
            value={selectedAddress}
            onChangeText={(text) => setSelectedAddress(text)}
            style={styles.addressDropdown}
          />
          <TextInput
            placeholder="Select a table number"
            value={selectTable}
            onChangeText={(text) => setSelectTable(text)}
            style={styles.addressDropdown}
          />
          <TextInput
            placeholder="Select table Capacity"
            value={selectCapacity}
            onChangeText={(text) => setSelectCapacity(text)}
            style={styles.addressDropdown}
          />
          <TouchableOpacity
            onPress={handleAddTable}
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
    backgroundColor: "gray",
  },
  fieldItem: {
    flex: 1,
    marginBottom: 8,
    // backgroundColor:'green',
    flexDirection: "row",
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontWeight: "bold",
    marginRight: 5,
  },
  fieldValue: {
    flex: 1,
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 5,
    borderRadius: 5,
    // backgroundColor: 'blue',
  },
  fieldInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 5,
    borderRadius: 5,
  },
  editFieldButton: {
    backgroundColor: "transparent",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  editFieldButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  saveFieldButton: {
    backgroundColor: "green",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  saveFieldButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  cancelFieldButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    marginLeft: 5,
    alignItems: "center",
  },
  cancelFieldButtonText: {
    color: "white",
    fontWeight: "bold",
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
  },
  deleteDocumentButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  deleteDocumentButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  inputField: {
    borderWidth: 1,
    borderColor: "lightgray",
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
  },
  addFieldButton: {
    backgroundColor: "transparent",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  addFieldButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  createNewDocumentButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  createNewDocumentButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  addressDropdownContainer: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontWeight: "bold",
    marginRight: 5,
    // backgroundColor: 'red',
    width: "31%",
  },
  addFieldButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  addressDropdown: {
    borderWidth: 1,
    borderColor: "lightgray",
    borderRadius: 5,
    marginTop: 5,
    marginBottom: 5,
  },
  addressSelectionButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  addressSelectionButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  selectDocumentButton: {
    backgroundColor: "transparent", // Customize the select button's style
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  selectDocumentButtonText: {
    color: "white", // Customize the text color
    fontWeight: "bold",
  },
});

export default TableScreen;
