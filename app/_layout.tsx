import { Stack } from "expo-router";
import { ThemeProvider } from "@/context/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            title: "Notes App",
          }}
        />
        <Stack.Screen
          name="loginScreen"
          options={{
            title: "Hello! 👋",
          }}
        />
        <Stack.Screen
          name="note"
          options={{
            title: "Note",
            headerBackTitle: "Home",
            headerStyle: { backgroundColor: "#1C1B20" },
            headerTintColor: "#F4F5FC",
          }}
        />
        <Stack.Screen
          name="comment"
          options={{
            title: "Comment",
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
