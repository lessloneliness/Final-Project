import { useNavigation } from "@react-navigation/core";
import { React, useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  Button,
  TouchableOpacity,
  Pressable,
  TextInput,
  View,
  Image,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { db, firestore, auth } from "../firebase";
import DropDownPicker from "react-native-dropdown-picker";
import DateTimePicker from "@react-native-community/datetimepicker";

const CreateEvent = () => {
  const myId = auth.currentUser.uid;
  const myEmail = auth.currentUser.email;

  const navigation = useNavigation();
  const [openFriends, setOpenFriends] = useState(false);
  const [chosenFriends, setChosenFriends] = useState([]);
  const [serverFriends, setServerFriends] = useState([]);
  const [EventName, setEventName] = useState(null);
  const [EventDescription, setEventDescription] = useState("");
  const [EventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState(new Date());
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    if (selectedDate) {
      const currentDate = selectedDate;
      setEventDate(currentDate);
    }
    setShow(false);
  };
  const showMode = (currentMode) => {
    setMode(currentMode);
  };

  const showDatepicker = () => {
    setShow(true);
    showMode("date");
  };

  const showTimepicker = () => {
    setShow(true);
    showMode("time");
  };

  useEffect(() => {
    const subscriber = db
      .collection("users")
      .doc(myId)
      .onSnapshot((documentSnapshot) => {
        const userFriends = documentSnapshot
          .data()
          .Friends.map((friend) => ({ label: friend, value: friend }));
        setServerFriends(userFriends);
      });
    return () => subscriber();
  }, [myId]);
  const CreateEvent = () => {
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
                EventsId: firestore.FieldValue.arrayUnion(EventName),
              });
          }
        });
      });
    db.collection("events")
      .doc(EventName)
      .set({
        members: [...chosenFriends, myEmail],
        name: EventName,
        discription: EventDescription,
        location: EventLocation,
        date: eventDate,
      })
      .then(() => navigation.replace("Home"));
  };
  return (
    <SafeAreaView>
         <View style={styles.inputContainer}>

      <Text style={styles.headerText}>Create Event</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setEventName}
          placeholder="Enter Event Name"
        ></TextInput>
        <TextInput
          style={styles.textInput}
          onChangeText={setEventDescription}
          placeholder="Event Description"
        ></TextInput>
        <TextInput
          style={styles.textInput}
          onChangeText={setEventLocation}
          placeholder="Event location"
        ></TextInput>
        <View>
          <View>
            <Pressable
              style={{
                fontSize: 15,
                borderWidth: 1,
                backgroundColor: "white",
                paddingHorizontal: 15,
                paddingVertical: 7,
                borderRadius: 10,
                marginTop: 15,
              }}
              onPress={showDatepicker}
              title="Ch"
            >
              <Text>Select Event Date</Text>
            </Pressable>
          </View>
          <View>
            <Pressable
              style={{
                fontSize: 15,
                borderWidth: 1,
                backgroundColor: "white",
                paddingHorizontal: 15,
                paddingVertical: 7,
                borderRadius: 10,
                marginTop: 15,
              }}
              onPress={showTimepicker}
              title="Ch"
            >
              <Text>Select Event Time</Text>
            </Pressable>
          </View>
          <Text>selected: {eventDate.toLocaleString()}</Text>
          {show && (
            <DateTimePicker
              testID="dateTimePicker"
              value={eventDate}
              mode={mode}
              is24Hour={true}
              onChange={onChange}
            />
          )}
        </View>
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
      <TouchableOpacity
        style={{
          backgroundColor: "#0782F9",
          width: "40%",
          padding: 7,
          borderRadius: 50,
          alignItems: "center",
          marginTop: '10%',
          marginHorizontal: "25%",
        }}
        onPress={CreateEvent}
      >
        <Text
          style={{ fontSize: 20, alignSelf: "center", alignItems: "center" }}
        >
          Create
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.replace("Home")}
        style={[styles.button, styles.buttonOutline]}
      >
        <Text style={styles.buttonOutlineText}>Back</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "white",
  },
  headerText: {
    fontSize: 20,
  },
  inputContainer: {
    paddingVertical: 15,
    justifyContent: "center",
    paddingHorizontal: 40,
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
    backgroundColor: "red",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
    marginHorizontal: "18%",

  },
 

 
 
});
