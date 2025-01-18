// import { useState, useEffect } from "react";
import * as SecureStore from "expo-secure-store";

import AsyncStorage from "@react-native-async-storage/async-storage";
import * as AuthSession from "expo-auth-session";

import { Platform } from "react-native";

const discovery = {
  authorizationEndpoint: "https://dev-yg.us.auth0.com/authorize",
  tokenEndpoint: "https://dev-yg.us.auth0.com/oauth/token",
};

const redirectUri = AuthSession.makeRedirectUri({
  native: "com.myapp:/home",
});
const authConfig = {
  clientId: "H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA",
  scopes: ["openid", "profile", "email", "offline_access"],
  redirectUri: redirectUri,
  codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
};

const TOKEN_KEY = "id_token";

// Store token securely
export const storeToken = async (token: string) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(TOKEN_KEY, token);
    } else {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
    }
  } catch (error) {
    console.error("Error storing token: ", error);
  }
};

// Retrieve stored token
export const getToken = async (): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(TOKEN_KEY);
    } else {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error retrieving token:", error);
    return null;
  }
};

export const clearToken = async () => {
  try {
    if (Platform.OS === "web") {
      localStorage.removeItem(TOKEN_KEY);
    } else {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
    }
  } catch (error) {
    console.error("Error clearing token: ", error);
  }
};

// Validate token (by making an API call)
export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const response = await fetch("https://ctsandbox.innohub.app/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const responseData = await response.json();
    console.log("response: ", responseData);
    return response.ok;
  } catch (error) {
    console.error("Token validation failed: ", error);
    return false;
  }
};

// Start auth request
export const useAuth = () => {
  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    authConfig,
    discovery
  );

  const exchangeToken = async (code: string) => {
    if (!request?.codeVerifier) {
      console.error("Code verifier is missing");
      return;
    }
    console.log("code verifier:", request.codeVerifier);

    try {
      const tokenResponse = await fetch(discovery.tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: authConfig.clientId,
          code: code,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
          audience: "https://dev-yg.us.auth0.com/api/v2/",
          code_verifier: request.codeVerifier,
        }).toString(),
      });

      if (!tokenResponse.ok) {
        const errorData = await tokenResponse.json();
        throw new Error("Token exchange failed: ", errorData.error);
      }
      const tokenData = await tokenResponse.json();
      console.log(tokenData);
      return tokenData.id_token;
    } catch (error) {
      console.error("Error during token exchange: ", error);
    }
  };
  return { request, response, promptAsync, exchangeToken };
};

// export const useAuth = () => {
//   const [request, response, promptAsync] = AuthSession.useAuthRequest(
//     authConfig,
//     discovery
//   );
//   const [key, setKey] = useState(0); // Key to force remount

//   const resetAuth = () => {
//     setKey((prevKey) => prevKey + 1);
//   };

// const exchangeToken = async (code: string) => {
//   if (!request?.codeVerifier) {
//     console.error("Code verifier is missing");
//     return;
//   }

//   try {
//     const tokenResponse = await fetch(discovery.tokenEndpoint, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       body: new URLSearchParams({
//         client_id: authConfig.clientId,
//         code: code,
//         redirect_uri: redirectUri,
//         grant_type: "authorization_code",
//         audience: "https://dev-yg.us.auth0.com/api/v2/",
//         code_verifier: request.codeVerifier,
//       }).toString(),
//     });

//     if (!tokenResponse.ok) {
//       const errorData = await tokenResponse.json();
//       throw new Error("Token exchange failed: ", errorData.error);
//     }

//     const tokenData = await tokenResponse.json();
//     // log token response for testing:
//     console.log(tokenData);
//     await storeToken("id_token", tokenData.id_token);
//   } catch (error) {
//     console.error("Error during token exchange: ", error);
//   }
// };

//   return {
//     key,
//     request,
//     response,
//     promptAsync,
//     exchangeToken,
//     resetAuth,
//   };
// };

// export const storeToken = async (key: string, value: string) => {
//   try {
//     if (Platform.OS === "web") {
//       localStorage.setItem(key, value);
//     } else {
//       await SecureStore.setItemAsync(key, value);
//     }
//   } catch (error) {
//     console.error(`Error storing ${key}:`, error);
//   }
// };

// export const getToken = async (key: string): Promise<string | null> => {
//   try {
//     if (Platform.OS === "web") {
//       return localStorage.getItem(key);
//     } else {
//       return await SecureStore.getItemAsync(key);
//     }
//   } catch (error) {
//     console.error(`Error retrieving ${key}:`, error);
//     return null;
//   }
// };

// export const clearToken = async (key: string): Promise<void> => {
//   try {
//     if (Platform.OS === "web") {
//       localStorage.removeItem(key);
//     } else {
//       await SecureStore.deleteItemAsync(key);
//     }
//   } catch (error) {
//     console.error("Error clearing token: ", error);
//   }
// };
