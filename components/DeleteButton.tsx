import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  onPress: () => void;
}

const DeleteButton = ({ onPress }: Props) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>Delete</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 90,
    borderWidth: 1,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderColor: "#FF0000",
    borderRadius: 10,
  },
  button: {
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonLabel: {
    fontSize: 16,
    color: "#FF0000",
  },
});

export default DeleteButton;
