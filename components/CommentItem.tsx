import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  body: string;
}

const CommentItem = ({ body }: Props) => {
  const { themeStyles } = useTheme();

  return (
    <View
      style={[
        styles.commentContainer,
        {
          backgroundColor: themeStyles.backgroundSecond,
          borderBottomColor: themeStyles.backgroundMain,
        },
      ]}
    >
      <Text style={[styles.comment, { color: themeStyles.textSecond }]}>
        {body}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  commentContainer: {
    padding: 15,
    width: "100%",
    borderBottomWidth: 2,
  },
  comment: {
    fontSize: 14,
  },
});

export default CommentItem;
