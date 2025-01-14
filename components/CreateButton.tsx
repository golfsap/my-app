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
        <Text style={styles.buttonLabel}>Create a new {buttonLabel}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    width: 170,
    height: 60,
    marginHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    padding: 3,
    // borderWidth: 1,
  },
  button: {
    backgroundColor: "#fff",
    borderRadius: 10,
    // borderWidth: 2,
    width: "100%",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  buttonLabel: {
    fontSize: 14,
  },
});

export default CreateButton;
