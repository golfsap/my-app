import React, { useEffect, useState } from "react";
import { Stack, Link, useRouter, useFocusEffect } from "expo-router";
import {
  Text,
  View,
  Pressable,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from "react-native";
import { clearToken } from "@/services/auth";
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

export default function HomePage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    handleGetUserProfile();
    handleGetUserNotes();
  }, []);

  useFocusEffect(() => {
    handleGetUserNotes();
  });

  const handleLogout = async () => {
    await clearToken();
    router.replace("/loginScreen");
  };

  const handleGetUserProfile = async () => {
    const userData = await getUserProfile();
    console.log(userData);
    setUser(userData);
  };

  const handleGetUserNotes = async () => {
    const userNotes = await getUserNotes();
    setNotes(userNotes);
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  const onAddNote = async (title: string, body: string) => {
    await createNote(title, body);
    setIsModalVisible(false);
    handleGetUserNotes();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Hi, " + user?.name + " 👋",
          headerRight: () => (
            <Pressable onPress={handleLogout} style={styles.logoutButton}>
              <Text style={styles.logoutButtonText}>Log out</Text>
            </Pressable>
          ),
        }}
      />

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButton: {
    marginRight: 10,
    padding: 5,
  },
  logoutButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  listContainer: {
    paddingBottom: 30,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
});
