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
  Picker,
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
    <View style={styles.container}>
      <Text style={styles.headerText}>Create Event</Text>
      <View style={styles.formContainer}>
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
                backgroundColor: "white",
                width: 280,
                height: 40,
                color: "black",
                borderWidth: 1,
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
                backgroundColor: "white",
                width: 280,
                height: 40,
                color: "black",
                borderWidth: 1,
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
          textAlign: "center",
          backgroundColor: "green",
          width: "35%",
          height: "5%",
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
    </View>
  );
};

export default CreateEvent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    // justifyContent:"center"
    alignItems: "center",
    justifyContent: "space-around",
  },
  headerText: {
    fontSize: 30,
  },
  formContainer: {
    width: "100%",
    height: "60%",
    zIndex: -1000,
    borderWidth: 1,
    alignItems: "center",
    //justifyContent: "space-around",
  },
  picker: {
    marginVertical: 10,
  },
  textInput: {
    width: "75%",
    height: "15%",
    fontSize: 15,
    borderWidth: 1,
  },
  button: {
    backgroundColor: "red",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  button2: {
    backgroundColor: "black",
    width: "40%",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "white",
    fontWeight: "700",
    fontSize: 16,
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
