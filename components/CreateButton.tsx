import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  buttonLabel: string;
  onPress: () => void;
}

const CreateButton = ({ buttonLabel, onPress }: Props) => {
  const { themeStyles } = useTheme();

  return (
    <View style={styles.buttonContainer}>
      <Pressable
        style={[styles.button, { backgroundColor: themeStyles.textSecond }]}
        onPress={onPress}
      >
        <Text
          style={[styles.buttonLabel, { color: themeStyles.backgroundMain }]}
        >
          +
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    bottom: 40,
    right: 40,
  },
  button: {
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
    fontSize: 28,
  },
});

export default CreateButton;
