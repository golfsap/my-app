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
import { useTheme } from "@/context/ThemeContext";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  const [user, setUser] = useState<Profile | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const router = useRouter();
  const { themeStyles } = useTheme();
  const dynamicStyles = createDynamicStyles(themeStyles);

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
    // console.log(userData);
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
    <SafeAreaView style={dynamicStyles.container}>
      <Stack.Screen
        options={{
          title: user ? `Hi, ${user.name} 👋` : "Loading...",
          headerLeft: () => (
            <Pressable
              onPress={handleLogout}
              style={dynamicStyles.logoutButton}
            >
              <Text style={dynamicStyles.logoutButtonText}>Log out</Text>
            </Pressable>
          ),
          headerRight: () => <ThemeToggle />,
          headerStyle: { backgroundColor: themeStyles.backgroundMain },
          headerTintColor: themeStyles.textMain,
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
        contentContainerStyle={dynamicStyles.listContainer}
      ></FlatList>
      <View style={dynamicStyles.buttonContainer}>
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

const createDynamicStyles = (themeStyles: any) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: themeStyles.backgroundMain,
    },
    logoutButton: {
      marginRight: 10,
      padding: 5,
    },
    logoutButtonText: {
      color: themeStyles.buttonColor,
      fontSize: 16,
    },
    listContainer: {
      paddingBottom: 30,
    },
    buttonContainer: {
      alignItems: "center",
      // marginBottom: 20,
    },
  });
