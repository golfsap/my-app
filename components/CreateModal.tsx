import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";

interface Props {
  isVisible: boolean;
  modalType: string;
  onClose: () => void;
  onAdd: (title: string, body: string) => void;
}

const CreateModal = ({ isVisible, modalType, onClose, onAdd }: Props) => {
  const [noteTitle, setNoteTitle] = useState("");
  const [noteBody, setNoteBody] = useState("");
  const [commentBody, setCommentBody] = useState("");

  const handleAddNote = () => {
    onAdd(noteTitle, noteBody);
    setNoteTitle("");
    setNoteBody("");
  };

  const handleAddComment = () => {
    onAdd("", commentBody);
    setCommentBody("");
  };

  return (
    <Modal transparent={true} visible={isVisible}>
      <Pressable onPress={onClose} style={styles.modalOverlay}>
        <KeyboardAvoidingView
          style={styles.modalContent}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Pressable>
            <View style={styles.titleContainer}>
              <Text style={styles.title}> Create {modalType}</Text>
              <Pressable
                onPress={
                  modalType === "note" ? handleAddNote : handleAddComment
                }
                style={styles.addBtn}
              >
                <Text>Add</Text>
              </Pressable>
            </View>
            {modalType === "note" ? (
              <>
                <Text style={styles.inputLabel}>Title</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Enter note..."
                  autoFocus
                  value={noteTitle}
                  onChangeText={setNoteTitle}
                />
                <Text style={styles.inputLabel}>Body</Text>
                <TextInput
                  style={styles.input}
                  value={noteBody}
                  onChangeText={setNoteBody}
                />
              </>
            ) : (
              <>
                <Text style={styles.inputLabel}>Body</Text>
                <TextInput
                  style={styles.input}
                  autoFocus
                  value={commentBody}
                  onChangeText={setCommentBody}
                />
              </>
            )}
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 40,
    // elevation: 5,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  addBtn: {
    padding: 7,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  inputLabel: {
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  closeButton: {},
  closeText: {
    marginBottom: 10,
    // fontSize: 18,
  },
});

export default CreateModal;
