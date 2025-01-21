import React from "react";
import { Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  onPress: () => void;
}

const DeleteButton = ({ onPress }: Props) => {
  const { themeStyles } = useTheme();

  return (
    <Pressable style={styles.buttonContainer} onPress={onPress}>
      <Text style={styles.buttonLabel}>Delete</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 5,
    marginRight: 10,
  },
  buttonLabel: {
    fontSize: 16,
    color: "#FF0000",
  },
});

export default DeleteButton;
