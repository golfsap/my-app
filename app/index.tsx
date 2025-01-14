import React, { useCallback, useEffect, useState } from "react";
import { Link, useRouter, useFocusEffect } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { Text, View, Pressable, StyleSheet, FlatList } from "react-native";
import { useAuth } from "../services/auth";
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

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      exchangeToken(code);
      setIsAuthenticated(true);
      handleGetUserProfile();
      handleGetUserNotes();
    } else if (response?.type === "error") {
      console.error("Authorization error: ", response.error);
    } else {
      console.log("Response dismissed or not handled: ", response?.type);
    }
  }, [response]);

  useFocusEffect(
    useCallback(() => {
      handleGetUserNotes();
    }, [])
  );

  const handleGetUserProfile = async () => {
    const userData = await getUserProfile();
    setUser(userData);
  };

  const handleGetUserNotes = async () => {
    const userNotes = await getUserNotes();
    setNotes(userNotes);
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
          <Text style={styles.name}>{user.name}'s notes</Text>
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
