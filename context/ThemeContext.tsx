import React, { createContext, useContext, useState, ReactNode } from "react";

export type Theme = "light" | "dark";

interface ThemeStyles {
  backgroundMain: string;
  backgroundSecond: string;
  textMain: string;
  textSecond: string;
  buttonColor: string;
  highlightColor: string;
}

interface ThemeContextProps {
  theme: Theme;
  themeStyles: ThemeStyles;
  toggleTheme: () => void;
}

const lightTheme: ThemeStyles = {
  backgroundMain: "#FFFFFF",
  backgroundSecond: "#f3f4f6",
  textMain: "#1f2937",
  textSecond: "#374151",
  buttonColor: "#007AFF",
  highlightColor: "#FF0000",
};

const darkTheme: ThemeStyles = {
  backgroundMain: "#111827",
  backgroundSecond: "#1f2937",
  textMain: "#ffffff",
  textSecond: "#c6cad0",
  buttonColor: "#86b3e6",
  highlightColor: "#c06398",
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<Theme>("light");

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const themeStyles = theme === "light" ? lightTheme : darkTheme;

  return (
    <ThemeContext.Provider value={{ theme, themeStyles, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
