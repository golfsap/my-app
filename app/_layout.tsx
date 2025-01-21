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
