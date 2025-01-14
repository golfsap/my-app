import { getToken } from "./auth";

export type Profile = {
  id: number;
  nickname: string;
  name: string;
  picture: string;
  email: string;
};

export type Note = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

export type Comment = {
  id: number;
  userId: number;
  noteId: number;
  body: string;
};

export const getUserProfile = async () => {
  const id_token = await getToken("id_token");
  const response = await fetch("https://ctsandbox.innohub.app/profile", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${id_token}`,
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export const getUserNotes = async (): Promise<Note[]> => {
  const id_token = await getToken("id_token");
  const response = await fetch("https://ctsandbox.innohub.app/notes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${id_token}`,
      "Content-Type": "application/json",
    },
  });

  return await response.json();
};

export const createNote = async (
  title: string,
  body: string
): Promise<void> => {
  try {
    const id_token = await getToken("id_token");
    const response = await fetch("https://ctsandbox.innohub.app/notes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${id_token}`,
      },
      body: JSON.stringify({
        title: title,
        body: body,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create note: ${errorData.message || response.status}`
      );
    }
  } catch (error) {
    console.error("Error in createNote function: ", error);
  }
};

export const deleteNoteById = async (noteId: number): Promise<void> => {
  try {
    const id_token = await getToken("id_token");
    const response = await fetch(
      `https://ctsandbox.innohub.app/notes/${noteId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to delete note: ${errorData.message || response.status}`
      );
    }
  } catch (error) {
    console.error("Error in deleteNoteById function: ", error);
  }
};

export const getNoteById = async (noteId: number): Promise<Note> => {
  const id_token = await getToken("id_token");
  const response = await fetch(
    `https://ctsandbox.innohub.app/notes/${noteId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${id_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
};

export const getNoteComments = async (noteId: number): Promise<Comment[]> => {
  const id_token = await getToken("id_token");
  const response = await fetch(
    `https://ctsandbox.innohub.app/comments?noteId=${noteId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${id_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
};

export const getCommentById = async (commentId: number): Promise<Comment> => {
  const id_token = await getToken("id_token");
  const response = await fetch(
    `https://ctsandbox.innohub.app/comments/${commentId}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${id_token}`,
        "Content-Type": "application/json",
      },
    }
  );
  return await response.json();
};

export const createComment = async (
  noteId: number,
  body: string
): Promise<void> => {
  try {
    const id_token = await getToken("id_token");
    const response = await fetch("https://ctsandbox.innohub.app/comments", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${id_token}`,
      },
      body: JSON.stringify({
        noteId: noteId,
        body: body,
      }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to create comment: ${errorData.message || response.status}`
      );
    }
  } catch (error) {
    console.error("Error in createComment function: ", error);
  }
};

export const deleteCommentById = async (commentId: number): Promise<void> => {
  try {
    const id_token = await getToken("id_token");
    const response = await fetch(
      `https://ctsandbox.innohub.app/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        `Failed to delete comment: ${errorData.message || response.status}`
      );
    }
  } catch (error) {
    console.error("Error in deleteCommentById function: ", error);
  }
};
