import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface Props {
  buttonLabel: string;
  onPress: () => void;
}

const CreateButton = ({ buttonLabel, onPress }: Props) => {
  const { themeStyles } = useTheme();

  const dynamicStyles = createDynamicStyles(themeStyles);

  return (
    <View style={dynamicStyles.buttonContainer}>
      <Pressable style={dynamicStyles.button} onPress={onPress}>
        <Text style={dynamicStyles.buttonLabel}>+</Text>
      </Pressable>
    </View>
  );
};

const createDynamicStyles = (themeStyles: any) =>
  StyleSheet.create({
    buttonContainer: {
      position: "absolute",
      bottom: 20,
      left: 120,
    },
    button: {
      backgroundColor: themeStyles.textSecond,
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
      color: themeStyles.backgroundMain,
      fontSize: 28,
    },
  });

export default CreateButton;
