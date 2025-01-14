import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  title: string;
  body: string;
}

const NoteItem = ({ title, body }: Props) => {
  return (
    <View style={styles.noteContainer}>
      <Text style={styles.noteTitle}>{title}</Text>
      <Text style={styles.noteBody}>{body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  noteContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  noteTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  noteBody: {
    fontSize: 12,
    flexWrap: "wrap",
  },
});

export default NoteItem;
