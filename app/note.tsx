import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
  Switch,
} from "react-native";
import {
  Stack,
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
  const [isDarkMode, setIsDarkMode] = useState(false);

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
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? "#1C1B20" : "#FFF" },
      ]}
    >
      <Stack.Screen
        options={{
          headerRight: () => <DeleteButton onPress={handleDeleteNote} />,
        }}
      />
      <Switch
        value={isDarkMode}
        onValueChange={(value) => setIsDarkMode(value)}
      />
      <Text style={styles.title}>{note.title}</Text>

      <Text style={styles.body}>{note.body}</Text>
      <Text style={styles.commentLabel}>Comments</Text>
      <FlatList
        data={comments}
        renderItem={({ item }) => (
          <Link
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

        <CreateModal
          isVisible={isModalVisible}
          modalType="comment"
          onClose={onModalClose}
          onAdd={onAddComment}
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
    padding: 20,
    backgroundColor: "#1C1B20",
  },
  // headerContainer: {
  //   display: "flex",
  //   flexWrap: "wrap",
  //   flexDirection: "column",
  //   marginBottom: 6,
  //   justifyContent: "space-between",
  //   borderWidth: 1,
  // },
  title: {
    width: "100%",
    // borderWidth: 1,
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#f4f5fc",
    paddingTop: 24,
    paddingHorizontal: 15,
  },
  body: {
    width: "100%",
    // borderWidth: 1,
    borderColor: "white",
    fontSize: 16,
    marginBottom: 20,
    color: "#f4f5fc",
    paddingTop: 10,
    paddingHorizontal: 15,
  },
  commentLabel: {
    width: "100%",
    color: "#666",
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  buttonContainer: {
    alignItems: "center",
    // marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 30,
  },
});
