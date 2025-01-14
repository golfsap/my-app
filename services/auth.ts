import * as SecureStore from "expo-secure-store";
import * as AuthSession from "expo-auth-session";
import { Platform } from "react-native";

const discovery = {
  authorizationEndpoint: "https://dev-yg.us.auth0.com/authorize",
  tokenEndpoint: "https://dev-yg.us.auth0.com/oauth/token",
};

const clientId = "H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA";
const redirectUri = AuthSession.makeRedirectUri({
  native: "com.myapp:/home",
});

const authConfig = {
  clientId: "H9F6QG5SzTKMv0tbmgxLj9LjG1EKVllA",
  scopes: ["openid", "profile", "email", "offline_access"],
  redirectUri: redirectUri,
  codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
};

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
      await storeToken("id_token", tokenData.id_token);
    } catch (error) {
      console.error("Error during token exchange: ", error);
    }
  };

  return {
    request,
    response,
    promptAsync,
    exchangeToken,
  };
};

export const storeToken = async (key: string, value: string) => {
  try {
    if (Platform.OS === "web") {
      localStorage.setItem(key, value);
    } else {
      await SecureStore.setItemAsync(key, value);
    }
  } catch (error) {
    console.error(`Error storing ${key}:`, error);
  }
};

export const getToken = async (key: string): Promise<string | null> => {
  try {
    if (Platform.OS === "web") {
      return localStorage.getItem(key);
    } else {
      return await SecureStore.getItemAsync(key);
    }
  } catch (error) {
    console.error(`Error retrieving ${key}:`, error);
    return null;
  }
};

// Login Function
// export const login = async (): Promise<any> => {
//   const [request, response, promptAsync] = AuthSession.useAuthRequest(
//     {
//       clientId: clientId,
//       scopes: ["openid", "profile", "email", "offline_access"],
//       redirectUri: redirectUri,
//       codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
//     },
//     discovery
//   );

//   if (response?.type === "success" && request?.codeVerifier) {
//     return { promptAsync, codeVerifier: request.codeVerifier };
//   }
// };
