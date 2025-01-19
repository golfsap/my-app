import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";

interface Props {
  buttonLabel: string;
  onPress: () => void;
}

const CreateButton = ({ buttonLabel, onPress }: Props) => {
  return (
    <View style={styles.buttonContainer}>
      <Pressable style={styles.button} onPress={onPress}>
        <Text style={styles.buttonLabel}>+</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 20,
    left: 120,
  },
  button: {
    backgroundColor: "#007AFF",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonLabel: {
    color: "white",
    fontSize: 28,
  },
});

export default CreateButton;
