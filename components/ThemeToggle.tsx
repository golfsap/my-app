import React from "react";
import { Switch } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "@/context/ThemeContext";

const ThemeToggle = () => {
  const { theme, themeStyles, toggleTheme } = useTheme();

  return (
    <>
      <Feather
        name={theme === "light" ? "sun" : "moon"}
        size={20}
        color={themeStyles.textSecond}
        style={{ marginRight: 7 }}
      />
      <Switch
        value={theme === "dark"}
        onValueChange={toggleTheme}
        thumbColor={themeStyles.backgroundSecond}
        trackColor={{
          false: "grey",
          true: themeStyles.highlightColor,
        }}
      />
    </>
  );
};

export default ThemeToggle;
