import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  Text,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { getToken, validateToken } from "../services/auth";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = await getToken();
      if (token && (await validateToken(token))) {
        router.replace("/home");
      } else {
        router.replace("/loginScreen");
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  if (loading) {
    return (
      <SafeAreaView>
        <Text style={styles.text}>Checking authentication...</Text>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  text: { padding: 20 },
});
