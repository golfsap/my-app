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
    // backgroundColor: "#fff",
    padding: 15,
    // borderWidth: 1,
    // borderBottomColor: "#ccc",
    width: "100%",
    backgroundColor: "#252429",
  },
  comment: {
    fontSize: 14,
    color: "#b4b2c0",
  },
});

export default CommentItem;
