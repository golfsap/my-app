import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Alert,
  Platform,
  SafeAreaView,
  Pressable,
  ScrollView,
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
import { useTheme } from "@/context/ThemeContext";

export default function NotePage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const noteId = parseInt(id, 10);
  const [note, setNote] = useState<Note | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const { themeStyles } = useTheme();

  useEffect(() => {
    fetchNote();
    fetchComments();
  }, [id]);

  useFocusEffect(() => {
    fetchComments();
  });

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

  const renderCommentItem = ({ item }: { item: Comment }) => (
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
  );

  if (!note) {
    return <Text>Loading note...</Text>;
  }

  return (
    <>
      <ScrollView style={{ backgroundColor: themeStyles.backgroundMain }}>
        <Stack.Screen
          options={{
            headerRight: () => <DeleteButton onPress={handleDeleteNote} />,
            headerStyle: {
              backgroundColor: themeStyles.backgroundMain,
            },
            headerTintColor: themeStyles.textMain,
          }}
        />

        <Text style={[styles.title, { color: themeStyles.textMain }]}>
          {note.title}
        </Text>

        <Text style={[styles.body, { color: themeStyles.textSecond }]}>
          {note.body}
        </Text>
        <Text style={[styles.commentLabel, { color: themeStyles.textMain }]}>
          Comments
        </Text>
        <FlatList
          data={comments}
          renderItem={renderCommentItem}
          keyExtractor={(item) => item.id.toString()}
          scrollEnabled={false}
          contentContainerStyle={styles.listContainer}
        ></FlatList>
      </ScrollView>
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
    </>
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
  title: {
    width: "100%",
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 5,
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  body: {
    width: "100%",
    fontSize: 16,
    marginBottom: 15,
    paddingTop: 7,
    paddingHorizontal: 15,
  },
  commentLabel: {
    width: "100%",
    paddingHorizontal: 15,
    marginBottom: 10,
    fontSize: 16,
    fontWeight: 500,
  },
  buttonContainer: {
    alignItems: "center",
    // marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 50,
  },
});
