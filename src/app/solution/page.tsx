"use client";
import React, { useState, useEffect } from "react";

interface Note {
  id: number;
  title: string;
  body: string;
  tags: string[];
}

const NoteTakingApp: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");
  const [newNoteTags, setNewNoteTags] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editedNoteTitle, setEditedNoteTitle] = useState("");
  const [editedNoteBody, setEditedNoteBody] = useState("");
  const [editedNoteTags, setEditedNoteTags] = useState("");
  const [deletingNoteId, setDeletingNoteId] = useState<number | null>(null);

  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const storedNotes = localStorage.getItem("notes");
      return storedNotes ? JSON.parse(storedNotes) : [];
    } catch (error) {
      console.error("Failed to load notes from localStorage:", error);
      return [];
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem("notes", JSON.stringify(notes));
    } catch (error) {
      console.error("Failed to save notes to localStorage:", error);
    }
  }, [notes]);

  const addNote = () => {
    if (newNoteTitle.trim() === "" || newNoteBody.trim() === "") {
      alert("Title and Body are required");
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: newNoteTitle,
      body: newNoteBody,
      tags: newNoteTags.split(",").map((tag) => tag.trim()),
    };
    setNotes([...notes, newNote]);
    setNewNoteTitle("");
    setNewNoteBody("");
    setNewNoteTags("");
  };

  const deleteNote = (id: number) => {
    setDeletingNoteId(id);
    setTimeout(() => {
      setNotes(notes.filter((note) => note.id !== id));
      setDeletingNoteId(null);
    }, 500);
  };

  const startEditingNote = (note: Note) => {
    setEditingNoteId(note.id);
    setEditedNoteTitle(note.title);
    setEditedNoteBody(note.body);
    setEditedNoteTags(note.tags.join(", "));
  };

  const saveEditedNote = () => {
    if (editedNoteTitle.trim() === "" || editedNoteBody.trim() === "") {
      alert("Title and Body are required");
      return;
    }

    setNotes(
      notes.map((note) =>
        note.id === editingNoteId
          ? {
              ...note,
              title: editedNoteTitle,
              body: editedNoteBody,
              tags: editedNoteTags.split(",").map((tag) => tag.trim()),
            }
          : note
      )
    );
    setEditingNoteId(null);
    setEditedNoteTitle("");
    setEditedNoteBody("");
    setEditedNoteTags("");
  };

  const discardEditingNote = () => {
    setEditingNoteId(null);
    setEditedNoteTitle("");
    setEditedNoteBody("");
    setEditedNoteTags("");
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  const uniqueTags = Array.from(new Set(notes.flatMap((note) => note.tags)));

  return (
    <div className="m-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Note Taking App</h1>

      <div className="flex flex-col items-center space-y-4">
        <input
          className="w-11/12 border rounded-md border-sky-500 p-2"
          type="text"
          placeholder="Title"
          value={newNoteTitle}
          onChange={(e) => setNewNoteTitle(e.target.value)}
        />
        <textarea
          className="w-11/12 border rounded-md border-sky-500 p-2"
          placeholder="Body"
          value={newNoteBody}
          onChange={(e) => setNewNoteBody(e.target.value)}
        />
        <input
          className="w-11/12 border rounded-md border-sky-500 p-2"
          type="text"
          placeholder="Tags (comma separated)"
          value={newNoteTags}
          onChange={(e) => setNewNoteTags(e.target.value)}
        />
        <button
          onClick={addNote}
          className="w-6/12 border rounded-md border-sky-500 p-2 bg-green-200 hover:bg-green-600 "
        >
          Add Note
        </button>
      </div>
      <input
        className="border rounded-md border-sky-500 p-2 mt-4 w-4/12"
        type="text"
        placeholder="Search notes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="mt-4">
        <h2 className="text-lg font-semibold">Search by Tags</h2>
        <div className="flex flex-wrap mt-2">
          {uniqueTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchTerm(tag)}
              className={`m-1 p-1 rounded-md border border-sky-500 ${
                searchTerm === tag ? "font-bold" : ""
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-4">
        {filteredNotes.map((note) => (
          <div
            className={`border rounded-md border-sky-500 m-1 p-2 transition-opacity duration-500 ease-out ${
              deletingNoteId === note.id ? "opacity-0" : "opacity-100"
            }`}
            key={note.id}
          >
            {editingNoteId === note.id ? (
              <div className="flex flex-col space-y-2">
                <input
                  className="border rounded-md border-sky-500 p-2"
                  type="text"
                  value={editedNoteTitle}
                  onChange={(e) => setEditedNoteTitle(e.target.value)}
                />
                <textarea
                  className="border rounded-md border-sky-500 p-2"
                  value={editedNoteBody}
                  onChange={(e) => setEditedNoteBody(e.target.value)}
                />
                <input
                  className="border rounded-md border-sky-500 p-2"
                  type="text"
                  value={editedNoteTags}
                  onChange={(e) => setEditedNoteTags(e.target.value)}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={saveEditedNote}
                    className="border rounded-md border-sky-500 p-2 bg-green-700 text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={discardEditingNote}
                    className="border rounded-md border-sky-500 p-2 bg-red-500 text-white"
                  >
                    Discard
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h3 className="text-lg font-semibold">Title: {note.title}</h3>
                <p className="text-sm">Desc: {note.body}</p>
                <p className="text-sm">Tags: {note.tags.join(", ")}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => startEditingNote(note)}
                    className="border rounded-md border-sky-500 p-2 bg-sky-500 text-white"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="border rounded-md border-sky-500 p-2 bg-red-500 text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NoteTakingApp;
