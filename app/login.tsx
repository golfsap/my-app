import React, { useState, useEffect } from "react";
import { Text, View, Button, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";

export default function Login() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  const getToken = async (key: string): Promise<string | null> => {
    if (Platform.OS === "web") {
      try {
        const token = localStorage.getItem(key);
        console.log(token);
        return token;
      } catch (e) {
        console.error("Local storage is unavailable: ", e);
      }
    } else {
      try {
        const token = await SecureStore.getItemAsync(key);
        console.log(token);
        return token;
      } catch (error) {
        console.error(`Error retrieving ${key}: `, error);
        return null;
      }
    }
  };

  const getUserInfo = async () => {
    const id_token = await getToken("id_token");
    const userResponse = await fetch("https://ctsandbox.innohub.app/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${id_token}`,
        "Content-Type": "application/json",
      },
    });

    if (userResponse.ok) {
      const userData = await userResponse.json();
      console.log(userData);
      setUser(userData);
    } else {
      console.error("Failed to fetch user info");
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  // getToken("id_token");

  return (
    <View style={styles.container}>
      <Text>This is the login page.</Text>
      {/* <Text>UserId: {user.userId}</Text> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
