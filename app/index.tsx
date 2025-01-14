import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  Button,
  Platform,
} from "react-native";
import * as AuthSession from "expo-auth-session";
import * as SecureStore from "expo-secure-store";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const router = useRouter();

  const discovery = {
    authorizationEndpoint: "https://dev-yg.us.auth0.com/authorize",
    tokenEndpoint: "https://dev-yg.us.auth0.com/oauth/token",
  };

  const redirectUri = AuthSession.makeRedirectUri({
    native: "com.myapp:/home",
  });

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: "H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA",
      scopes: ["openid", "profile", "email", "offline_access"],
      redirectUri: redirectUri,
      codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      // console.log("Authorization code: ", response.params);
      // console.log("Code Verifier: ", request?.codeVerifier);

      // Exchange code for token
      exchangeToken(code);
      router.push("/login");
    } else if (response?.type === "error") {
      console.error("Authorization error: ", response.error);
    } else {
      console.log("Response dismissed or not handled: ", response?.type);
    }
  }, [response]);

  const exchangeToken = async (code: string) => {
    if (!request?.codeVerifier) {
      console.error("Code verifier is missing");
      return;
    }

    try {
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: "H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA",
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
          audience: "https://dev-yg.us.auth0.com/api/v2/",
          code_verifier: request?.codeVerifier,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        console.log(tokenResponse);
        const errorData = await tokenResponse.json();
        throw new Error("Token exchange failed:", errorData.error);
      }

      const tokenData = await tokenResponse.json();
      console.log("Token Response: ", tokenData);

      // Store the token securely with secure store:
      await storeToken("id_token", tokenData.id_token);
    } catch (error) {
      console.error("Error during token exchange: ", error);
    }
  };

  const storeToken = async (key: string, value: string) => {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      try {
        await SecureStore.setItemAsync(key, value);
        console.log(`${key} stored successfully`);
      } catch (error) {
        console.error(`Error storing ${key}: `, error);
      }
    }
  };

  console.log("Redirect URI:", redirectUri);
  console.log(discovery);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the Notes app.</Text>

      <Pressable style={styles.button} onPress={() => promptAsync()}>
        <Text style={styles.buttonLabel}>Log in</Text>
      </Pressable>
      {/* <Pressable style={styles.button} onPress={handleLogOut}>
        <Text style={styles.buttonLabel}>Log out</Text>
      </Pressable> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontWeight: 500,
    marginBottom: 10,
  },
  button: {
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 7,
    borderColor: "rgb(0, 122,255)",
  },
  buttonLabel: {
    color: "rgb(0,122,255)",
  },
});
