import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface Props {
  body: string;
}

const CommentItem = ({ body }: Props) => {
  return (
    <View style={styles.commentContainer}>
      <Text style={styles.comment}>{body}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: "100%",
  },
  comment: {
    fontSize: 14,
  },
});

export default CommentItem;
