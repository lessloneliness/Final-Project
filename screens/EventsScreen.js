import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { auth } from "../firebase";

const EventsScreen = ({ navigation }) => {
  const [list, setList] = useState([]);
  const user = auth.currentUser;
  const userRef = firebase.firestore().collection("users").doc(user.uid); // get the uid.
  useEffect(() => {
    userRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setList(
            doc.data().EventsId.map((item, index) => ({
              id: item + index,
              title: item,
            }))
          );
        } else {
          console.log("No such document!");
        }
      })
      .catch(function (error) {
        console.log("Error getting document:", error);
      });
  }, []);

  const Item = ({ item }) => (
    <TouchableOpacity style={[styles.item]}>
      <Text style={styles.text1}> Event</Text>
      <Text style={[styles.title]}>{item.title}</Text>
    </TouchableOpacity>
  );
  const renderItem = ({ item }) => {
    return <Item item={item} />;
  };

  return (
    <View
      style={{ justifyContent: "center", marginTop: 30, alignItems: "center" }}
    >
      <Text style={styles.text}> My Events</Text>
      <FlatList
        data={list}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity
        onPress={() => navigation.replace("Home")}
        style={[styles.button, styles.buttonOutline]}
      >
        <Text style={styles.buttonOutlineText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EventsScreen;

const styles = StyleSheet.create({
  button: {
    backgroundColor: "red",
    width: "60%",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 40,
  },
  container: {
    flex: 1,
    marginTop: 2,
  },
  item: {
    padding: 2,
    fontSize: 15,
    marginTop: 0,
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    padding: 2,
  },
  text: {
    fontSize: 23,
    color: "green",
    fontStyle: "italic",
    marginTop: 0,
    marginBottom: 33,
    textDecorationLine: "underline",
  },
  text1: {
    color: "red",
    textDecorationLine: "underline",
  },
});
