import { useState, useEffect } from 'react';
import Masonry from 'react-masonry-css';
import { toast, Toaster } from 'react-hot-toast';
import NoteCard from './components/NoteCard';
import NoteDialog from './components/NoteDialog';
import LoadingSpinner from './components/LoadingSpinner';
import { useNotes } from './hooks/useNotes';

function App() {
  const { notes, loading, fetchNotes, saveNote, togglePin, deleteNote } = useNotes();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const notesPerPage = 6;

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSaveNote = async (noteData) => {
    const success = await saveNote(noteData, selectedNote);
    if (success) {
      setIsDialogOpen(false);
      setSelectedNote(null);
    }
  };

  const handleDeleteNote = async (noteId) => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(noteId);
    }
  };

  const totalPages = Math.ceil(notes.length / notesPerPage);
  const paginatedNotes = notes.slice(
    (currentPage - 1) * notesPerPage,
    currentPage * notesPerPage
  );

  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notekeeper</h1>
            <p className="text-gray-600 mt-1">Your thoughts, organized.</p>
          </div>
          <button
            onClick={() => {
              setSelectedNote(null);
              setIsDialogOpen(true);
            }}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <span>Add Note</span>
          </button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <Masonry
              breakpointCols={breakpointColumns}
              className="flex -ml-4 w-auto"
              columnClassName="pl-4 bg-clip-padding"
            >
              {paginatedNotes.map(note => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onPin={togglePin}
                  onDelete={handleDeleteNote}
                  onClick={() => {
                    setSelectedNote(note);
                    setIsDialogOpen(true);
                  }}
                />
              ))}
            </Masonry>

            {totalPages > 1 && (
              <div className="flex justify-center mt-8 gap-2">
                {[...Array(totalPages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-md transition-colors ${
                      currentPage === i + 1
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <NoteDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
        onSave={handleSaveNote}
      />

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </div>
  );
}

export default App;