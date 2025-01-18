import React, { useEffect, useState } from "react";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { Text, View, Pressable, StyleSheet, FlatList } from "react-native";
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
  }, []);

  const handleLogout = async () => {
    await clearToken();
    router.replace("/loginScreen");
  };

  const handleGetUserProfile = async () => {
    const userData = await getUserProfile();
    console.log(userData);
    setUser(userData);
  };

  return (
    <View>
      <Text>Hello, {user?.name}</Text>
      <Pressable onPress={handleLogout}>
        <Text>Log out</Text>
      </Pressable>
    </View>
  );
}
