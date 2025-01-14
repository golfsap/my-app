import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Alert, Platform } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import {
  Note,
  Comment,
  getNoteById,
  getCommentById,
  deleteCommentById,
} from "@/services/api";
import DeleteButton from "@/components/DeleteButton";

export default function CommentPage() {
  const router = useRouter();
  const { noteId, commentId } = useLocalSearchParams<{
    noteId: string;
    commentId: string;
  }>();
  const comment_Id = parseInt(commentId, 10);
  // const [note, setNote] = useState<Note | null>(null);
  const [comment, setComment] = useState<Comment | null>(null);

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

  useEffect(() => {
    fetchComment();
  }, [commentId]);

  if (!comment) {
    return <Text>Loading comment...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.body}>{comment.body}</Text>
      <DeleteButton onPress={handleDeleteComment}></DeleteButton>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  body: {
    marginBottom: 20,
  },
});
