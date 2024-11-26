import { useState, useEffect } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useHotkeys } from "react-hotkeys-hook";
import { AnimatePresence } from "framer-motion";
import NoteDialog from "./components/NoteDialog";
import LoadingSkeleton from "./components/LoadingSkeleton";
import SearchBar from "./components/SearchBar";
import CategorySelect from "./components/CategorySelect";
import VirtualizedNoteGrid from "./components/VirtualizedNoteGrid";
import ThemeToggle from "./components/ThemeToggle";
import { useNotes } from "./hooks/useNotes";
import { useSearch } from "./hooks/useSearch";
import { useDarkMode } from "./hooks/useDarkMode";
import {
  doc,
  collection,
  addDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";

function App() {
  const { notes, loading, fetchNotes, saveNote, togglePin, deleteNote } =
    useNotes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState({
    id: "all",
    name: "All Notes",
  });
  const [isDark, setIsDark] = useDarkMode();

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Keyboard shortcuts
  useHotkeys("ctrl+k, cmd+k", (e) => {
    e.preventDefault();
    document.querySelector('[aria-label="Search notes"]')?.focus();
  });

  useHotkeys("ctrl+n, cmd+n", (e) => {
    e.preventDefault();
    setSelectedNote(null);
    setIsDialogOpen(true);
  });

  useHotkeys("esc", () => {
    if (isDialogOpen) {
      setIsDialogOpen(false);
      setSelectedNote(null);
    }
  });

  const filteredNotes = useSearch(
    notes.filter(
      (note) =>
        selectedCategory.id === "all" || note.category === selectedCategory.id
    ),
    searchTerm
  );

  const handleSaveNote = async (noteData) => {
    try {
      if (selectedNote) {
        const noteRef = doc(db, "notes", selectedNote.id);
        await updateDoc(noteRef, {
          ...noteData,
          updatedAt: serverTimestamp(),
        });
      } else {
        await addDoc(collection(db, "notes"), {
          ...noteData,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      setIsDialogOpen(false);
      setSelectedNote(null);
      toast.success("Note saved successfully");
    } catch (error) {
      console.error("Error saving note:", error);
      toast.error("Failed to save note");
    }
  };

  // const noteData = {
  //   title: title,
  //   content: content,
  //   updatedAt: serverTimestamp(),
  //   // other fields like pinned status if needed
  // };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote(noteId);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Notekeeper
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Your thoughts, organized.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle isDark={isDark} onToggle={() => setIsDark(!isDark)} />
            <button
              onClick={() => {
                setSelectedNote(null);
                setIsDialogOpen(true);
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
              aria-label="Add new note"
            >
              <span>Add Note</span>
              <kbd className="hidden sm:inline-block px-2 py-1 text-xs font-semibold bg-indigo-700 rounded">
                ⌘N
              </kbd>
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6">
          <div className="flex-1">
            <SearchBar
              value={searchTerm}
              onChange={setSearchTerm}
              showShortcut
            />
          </div>
          <div className="w-48">
            <CategorySelect
              selected={selectedCategory}
              onChange={setSelectedCategory}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <VirtualizedNoteGrid
              notes={filteredNotes}
              onPin={togglePin}
              onDelete={handleDeleteNote}
              onNoteClick={(note) => {
                setSelectedNote(note);
                setIsDialogOpen(true);
              }}
            />
          )}
        </AnimatePresence>
      </div>

      <NoteDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedNote(null);
        }}
        onSave={handleSaveNote}
        note={selectedNote}
      />

      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "dark:bg-gray-800 dark:text-white",
          duration: 3000,
        }}
      />
    </div>
  );
}

export default App;
