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

const GroupsScreen = ({ navigation }) => {
  const [list, setList] = useState([]);
  const user = auth.currentUser;
  const userRef = firebase.firestore().collection("users").doc(user.uid); // get the uid.
  useEffect(() => {
    userRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          setList(
            doc.data().GroupsId.map((item, index) => ({
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
      <Text style={[styles.title]}>{item.title}</Text>
    </TouchableOpacity>
  );
  const renderItem = ({ item }) => {
    return <Item item={item} />;
  };

  return (
    <View>
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

export default GroupsScreen;

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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: "blue",
  },
  title: {
    fontSize: 32,
  },
});
