import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
} from "react-native";
import {
  useLocalSearchParams,
  Link,
  useRouter,
  useFocusEffect,
} from "expo-router";

import {
  Note,
  Comment,
  getNoteById,
  getNoteComments,
  deleteNoteById,
  createComment,
} from "@/services/api";
import CommentItem from "@/components/CommentItem";
import DeleteButton from "@/components/DeleteButton";
import CreateButton from "@/components/CreateButton";
import CreateModal from "@/components/CreateModal";

export default function NotePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const noteId = parseInt(id, 10);
  const [note, setNote] = useState<Note | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);

  const fetchNote = async () => {
    try {
      const fetchedNote = await getNoteById(noteId);
      setNote(fetchedNote);
    } catch (error) {
      console.error("Error fetching note: ", error);
    }
  };

  const fetchComments = async () => {
    try {
      const fetchedComments = await getNoteComments(noteId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error fetching comments: ", error);
    }
  };

  const handleDeleteNote = async () => {
    if (Platform.OS === "web") {
      alert("Delete note.");
      deleteNoteById(noteId);
      router.back();
    } else {
      Alert.alert("Delete note", "Are you sure you want to delete this note?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deleteNoteById(noteId);
            router.back();
          },
        },
      ]);
    }
  };

  const onAddComment = async (title: string = "", body: string) => {
    await createComment(noteId, body);
    // setIsModalVisible(false);
    fetchComments();
  };

  const onModalClose = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchNote();
    fetchComments();
  }, [id]);

  useFocusEffect(() => {
    fetchComments();
  });

  if (!note) {
    return <Text>Loading note...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{note.title}</Text>
        <DeleteButton onPress={handleDeleteNote} />
      </View>
      <Text style={styles.body}>{note.body}</Text>
      <Text style={styles.commentLabel}>Comments:</Text>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <Link
            style={styles.commentLink}
            href={{
              pathname: "/comment",
              params: {
                noteId: noteId,
                commentId: item.id,
              },
            }}
          >
            <CommentItem body={item.body}></CommentItem>
          </Link>
        )}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      ></FlatList>
      <View style={styles.buttonContainer}>
        <CreateButton
          buttonLabel="comment"
          onPress={() => setIsModalVisible(true)}
        ></CreateButton>
      </View>
      <CreateModal
        isVisible={isModalVisible}
        modalType="comment"
        onClose={onModalClose}
        onAdd={onAddComment}
      ></CreateModal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  headerContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    marginBottom: 6,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  body: {
    fontSize: 16,
    marginBottom: 10,
  },
  commentLabel: {
    color: "#666",
    marginBottom: 10,
  },
  listContainer: {},
  buttonContainer: {
    alignItems: "center",
  },
  error: {},
  commentLink: {},
});
