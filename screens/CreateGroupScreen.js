import { useNavigation } from "@react-navigation/core";
import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  View,
  Image,
  Picker,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { db, firestore, auth } from "../firebase";
import DropDownPicker from "react-native-dropdown-picker";

const GroupScreen = () => {
  const myId = auth.currentUser.uid;
  const myEmail = auth.currentUser.email;

  const navigation = useNavigation();
  const [openHobbies, setOpenHobbies] = useState(false);
  const [chosenHobbies, setChosenHobbies] = useState([]);
  const [serverHobbies, setServerHobbies] = useState([]);
  const [openFriends, setOpenFriends] = useState(false);
  const [chosenFriends, setChosenFriends] = useState([]);
  const [serverFriends, setServerFriends] = useState([]);
  const [groupName, setGroupName] = useState(null);
  useEffect(() => {
    const subscriber = db
      .collection("users")
      .doc(myId)
      .onSnapshot((documentSnapshot) => {
        const userFriends = documentSnapshot
          .data()
          .Friends.map((friend) => ({ label: friend, value: friend }));
        setServerFriends(userFriends);
        const userHobbies = documentSnapshot
          .data()
          .HobbiesId.map(({ item }) => ({ label: item, value: item }));
        setServerHobbies(userHobbies);
      });
    return () => subscriber();
  }, [myId]);
  const createGroup = () => {
    const serverUsers = new Map([[myEmail, myId]]);
    db.collection("users")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((documentSnapshot) => {
          const id = documentSnapshot.id;
          const email = documentSnapshot.data().Email;
          if (id && email && !serverUsers.get(email)) {
            serverUsers.set(email, id);
          }
        });
        [...chosenFriends, myEmail].forEach((value) => {
          const freindId = serverUsers.get(value);
          if (freindId) {
            db.collection("users")
              .doc(freindId)
              .update({
                GroupsId: firestore.FieldValue.arrayUnion(groupName),
              });
          }
        });
      });
    db.collection("group")
      .doc(groupName)
      .set({
        hobbies: chosenHobbies,
        members: [...chosenFriends, myEmail],
        name: groupName,
      })
      .then(() => navigation.replace("Home"));
  };
  return (
    <SafeAreaView style={styles.contentContainer}>

    <View style={styles.inputContainer}>
      <Text style={styles.headerText}>Create Group</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setGroupName}
          placeholder="Enter Group Name"
        ></TextInput>
        <DropDownPicker
          style={styles.picker}
          zIndex={3000}
          zIndexInverse={1000}
          multiple={true}
          mode="BADGE"
          open={openHobbies}
          value={chosenHobbies}
          items={serverHobbies}
          setOpen={setOpenHobbies}
          setValue={setChosenHobbies}
          setItems={setServerHobbies}
          placeholder="Select Hobbies"
        />
        <DropDownPicker
          style={styles.picker}
          zIndex={2000}
          zIndexInverse={2000}
          multiple={true}
          mode="BADGE"
          open={openFriends}
          value={chosenFriends}
          items={serverFriends}
          setOpen={setOpenFriends}
          setValue={setChosenFriends}
          setItems={setServerFriends}
          placeholder="Select Friends"
        />
      </View>
      <TouchableOpacity style={[styles.button, styles.buttonOutline]}
        onPress={createGroup}
      >
        <Text
          style={{ fontSize: 20, alignSelf: "center", alignItems: "center" }}
        >
          Create
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.replace("Home")}
        style={[styles.button2, styles.buttonText]}
      >
        <Text style={styles.buttonOutlineText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GroupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    // justifyContent:"center"
  },
  
  inputContainer: {
    paddingVertical: 15,
    justifyContent: "center",
    paddingHorizontal: 20,  },
    
  headerText: {
    fontSize: 20,
  },
  formContainer: {
    width: "100%",
    height: "60%",
    zIndex: -1000,
    borderWidth: 0,
    alignItems: "center",
    //justifyContent: "space-around",
  },
  picker: {
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 10,
    marginBottom:5,
  },
  textInput: {
    fontSize: 15,
    borderWidth: 1,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 15,
  },
  button: {
    backgroundColor: "#0782F9",
    width: "40%",
    padding: 7,
    borderRadius: 50,
    alignItems: "center",
    marginTop: '50%',
    marginHorizontal: "25%",


  },
  button2: {
    backgroundColor: "white", // sumbit btn
    padding: 10,
    width: 100,
    borderRadius: 50,
    alignItems: "center",
    borderWidth: 1,
  },
  buttonText: {
    color: "green",
    fontSize: 2,
    marginTop: '5%',
    backgroundColor: "red",
    marginHorizontal: "33%",
  },
  Image: {
    width: 150,
    height: 150,
    borderRadius: 150 / 2,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "black",
    marginBottom: "1%",
    marginHorizontal: "30%",
    marginVertical: "0%",
  },
  textAreaContainer: {
    borderColor: "gray",
    borderWidth: 0,
    padding: 1,
    backgroundColor: "rgba(52, 52, 52, 0.1)",
    marginHorizontal: "7%",
  },
  textArea: {
    height: 70,
    justifyContent: "flex-start",
  },
});
