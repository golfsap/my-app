import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Alert,
  Platform,
  ScrollView,
} from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";

import {
  Comment,
  getNoteById,
  getCommentById,
  deleteCommentById,
} from "@/services/api";
import DeleteButton from "@/components/DeleteButton";
import { useTheme } from "@/context/ThemeContext";

export default function CommentPage() {
  const router = useRouter();
  const { noteId, commentId } = useLocalSearchParams<{
    noteId: string;
    commentId: string;
  }>();
  const comment_Id = parseInt(commentId, 10);
  // const [note, setNote] = useState<Note | null>(null);
  const [comment, setComment] = useState<Comment | null>(null);
  const { themeStyles } = useTheme();

  useEffect(() => {
    fetchComment();
  }, [commentId]);

  const fetchComment = async () => {
    try {
      const fetchedComment = await getCommentById(comment_Id);
      setComment(fetchedComment);
    } catch (error) {
      console.error("Error fetching comment: ", error);
    }
  };

  const handleDeleteComment = async () => {
    if (Platform.OS === "web") {
      alert("Delete comment.");
      deleteCommentById(comment_Id);
      router.back();
    } else {
      Alert.alert(
        "Delete comment",
        "Are you sure you want to delete this comment?",
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Delete",
            style: "destructive",
            onPress: () => {
              deleteCommentById(comment_Id);
              router.back();
            },
          },
        ]
      );
    }
  };

  if (!comment) {
    return <Text>Loading comment...</Text>;
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: themeStyles.backgroundMain },
      ]}
    >
      <Stack.Screen
        options={{
          headerRight: () => <DeleteButton onPress={handleDeleteComment} />,
          headerStyle: {
            backgroundColor: themeStyles.backgroundMain,
          },
          headerTintColor: themeStyles.textMain,
        }}
      />
      <Text
        style={[
          styles.body,
          {
            color: themeStyles.textMain,
            backgroundColor: themeStyles.backgroundMain,
            borderColor: themeStyles.backgroundSecond,
          },
        ]}
      >
        {comment.body}
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  body: {
    fontSize: 14,
    marginBottom: 20,
    borderWidth: 2,
    padding: 10,
    borderRadius: 10,
  },
});
