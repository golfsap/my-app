import React, { useCallback, useEffect, useState } from "react";
import { Link, useRouter, useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Pressable, StyleSheet, FlatList } from "react-native";
import { useAuth, getToken, clearToken } from "../services/auth";
import NoteItem from "@/components/NoteItem";
import {
  Profile,
  Note,
  getUserProfile,
  getUserNotes,
  createNote,
} from "@/services/api";
import CreateButton from "@/components/CreateButton";
import CreateModal from "@/components/CreateModal";

WebBrowser.maybeCompleteAuthSession();

export default function Index() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<Profile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const router = useRouter();

  const { request, response, promptAsync, exchangeToken } = useAuth();

  // When opening new window, if authenticated, will automatically show notes
  useEffect(() => {
    const checkAuth = async () => {
      const id_token = await getToken("id_token");
      if (id_token) {
        setIsAuthenticated(true);
        handleGetUserProfile();
        handleGetUserNotes();
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      exchangeToken(code);
      setIsAuthenticated(true);
      handleGetUserProfile();
      handleGetUserNotes();
    } else if (response?.type === "error") {
      console.error("Authorization error: ", response.error);
    }
  }, [response]);

  useFocusEffect(
    useCallback(() => {
      if (isAuthenticated) {
        handleGetUserNotes();
      }
    }, [isAuthenticated])
  );

  const handleGetUserProfile = async () => {
    const userData = await getUserProfile();
    setUser(userData);
  };

  const handleGetUserNotes = async () => {
    const userNotes = await getUserNotes();
    setNotes(userNotes);
  };

  const handleLogout = async () => {
    await clearToken("id_token");
    setIsAuthenticated(false);
    setUser(null);
    setNotes([]);
    // const logoutUrl = `https://dev-yg.us.auth0.com/oidc/logout?id_token_hint={yourIdToken}&post_logout_redirect_uri={yourCallbackUrl}`
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onAddNote = async (title: string, body: string = "") => {
    await createNote(title, body);
    setIsModalVisible(false);
    // Re-fetch all notes
    handleGetUserNotes();
  };

  return (
    <View style={styles.container}>
      {isAuthenticated && user ? (
        <>
          <View style={styles.header}>
            <Text style={styles.name}>{user.name}'s notes</Text>
            <Pressable onPress={handleLogout}>
              <Text style={styles.buttonLabel}>Log out</Text>
            </Pressable>
          </View>
          <FlatList
            data={notes}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: "/note",
                  params: {
                    id: item.id,
                  },
                }}
              >
                <NoteItem title={item.title} body={item.body}></NoteItem>
              </Link>
            )}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContainer}
          ></FlatList>
          <View style={styles.buttonContainer}>
            <CreateButton
              buttonLabel="note"
              onPress={() => setIsModalVisible(true)}
            ></CreateButton>
            <CreateModal
              isVisible={isModalVisible}
              modalType="note"
              onClose={onModalClose}
              onAdd={onAddNote}
            ></CreateModal>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.title}>Welcome to the Notes app.</Text>
          <Pressable style={styles.button} onPress={() => promptAsync()}>
            <Text style={styles.buttonLabel}>Log in</Text>
          </Pressable>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    // borderWidth: 1,
  },
  name: {
    fontWeight: 500,
    margin: 5,
  },
  listContainer: {
    paddingBottom: 30,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
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
