import { useState, useCallback } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(collection(db, 'notes'), orderBy('pinned', 'desc'), orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);
      const fetchedNotes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNotes(fetchedNotes);
    } catch (error) {
      toast.error('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveNote = async (noteData, existingNote = null) => {
    try {
      if (existingNote) {
        await updateDoc(doc(db, 'notes', existingNote.id), {
          ...noteData,
          timestamp: serverTimestamp()
        });
        toast.success('Note updated successfully');
      } else {
        await addDoc(collection(db, 'notes'), {
          ...noteData,
          pinned: false,
          timestamp: serverTimestamp()
        });
        toast.success('Note added successfully');
      }
      await fetchNotes();
      return true;
    } catch (error) {
      toast.error('Failed to save note');
      return false;
    }
  };

  const togglePin = async (noteId) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      await updateDoc(doc(db, 'notes', noteId), {
        pinned: !noteToUpdate.pinned
      });
      toast.success(noteToUpdate.pinned ? 'Note unpinned' : 'Note pinned');
      await fetchNotes();
    } catch (error) {
      toast.error('Failed to pin note');
    }
  };

  const deleteNote = async (noteId) => {
    try {
      await deleteDoc(doc(db, 'notes', noteId));
      toast.success('Note deleted successfully');
      await fetchNotes();
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  return {
    notes,
    loading,
    fetchNotes,
    saveNote,
    togglePin,
    deleteNote
  };
}