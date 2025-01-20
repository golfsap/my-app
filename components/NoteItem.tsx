import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  title: string;
  body: string;
}

const NoteItem = ({ title, body }: Props) => {
  const { themeStyles } = useTheme();

  const dynamicStyles = createDynamicStyles(themeStyles);

  return (
    <View style={dynamicStyles.noteContainer}>
      <Text style={dynamicStyles.noteTitle}>{title}</Text>
      <Text style={dynamicStyles.noteBody}>{body}</Text>
    </View>
  );
};

const createDynamicStyles = (themeStyles: any) =>
  StyleSheet.create({
    noteContainer: {
      backgroundColor: themeStyles.backgroundMain,
      padding: 15,
      borderBottomWidth: 2,
      borderBottomColor: themeStyles.backgroundSecond,
      width: "100%",
    },
    noteTitle: {
      fontSize: 16,
      fontWeight: "bold",
      color: themeStyles.textMain,
      marginBottom: 5,
    },
    noteBody: {
      fontSize: 13,
      flexWrap: "wrap",
      color: themeStyles.textSecond,
    },
  });

export default NoteItem;
