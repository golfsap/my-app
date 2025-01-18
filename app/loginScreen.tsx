import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { useAuth, storeToken } from "../services/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { response, promptAsync, exchangeToken } = useAuth();

  useEffect(() => {
    const handleLoginResponse = async () => {
      if (response?.type === "success") {
        console.log("response:", response);
        const { code } = response.params;
        // Exchange authorization code for tokens
        const token = await exchangeToken(code);
        if (token) {
          await storeToken(token);
          router.replace("/home");
        }
      }
    };
    handleLoginResponse();
  }, [response]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the notes app!</Text>
      <Pressable style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonText}>Log In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 20, marginBottom: 20 },
  button: { padding: 15, backgroundColor: "blue", borderRadius: 5 },
  buttonText: { color: "white", fontWeight: "bold" },
});
