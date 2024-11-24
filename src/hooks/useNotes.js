import { useState, useCallback } from 'react';
import { collection, query, orderBy, getDocs, addDoc, updateDoc, doc, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { toast } from 'react-hot-toast';
import { getErrorMessage, AppError } from '../utils/errorHandler';
import { StatusCodes } from 'http-status-codes';
import debounce from 'lodash.debounce';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'notes'), 
        orderBy('pinned', 'desc'), 
        orderBy('timestamp', 'desc')
      );
      const querySnapshot = await getDocs(q);
      const fetchedNotes = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp || serverTimestamp()
      }));
      setNotes(fetchedNotes);
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw new AppError('Failed to fetch notes', StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
      setLoading(false);
    }
  }, []);

  const validateNote = (noteData) => {
    if (!noteData.title?.trim()) {
      throw new AppError('Title is required', StatusCodes.BAD_REQUEST);
    }
    if (!noteData.body?.trim()) {
      throw new AppError('Note content is required', StatusCodes.BAD_REQUEST);
    }
    if (noteData.title.length > 100) {
      throw new AppError('Title must be less than 100 characters', StatusCodes.BAD_REQUEST);
    }
  };

  const debouncedSave = debounce(async (noteData, existingNote) => {
    try {
      validateNote(noteData);
      const noteWithTimestamp = {
        ...noteData,
        timestamp: serverTimestamp()
      };

      if (existingNote) {
        await updateDoc(doc(db, 'notes', existingNote.id), noteWithTimestamp);
        toast.success('Note updated successfully');
      } else {
        await addDoc(collection(db, 'notes'), {
          ...noteWithTimestamp,
          pinned: false
        });
        toast.success('Note added successfully');
      }
      await fetchNotes();
      return true;
    } catch (error) {
      if (error instanceof AppError) {
        toast.error(error.message);
      } else {
        toast.error(getErrorMessage(error));
      }
      return false;
    }
  }, 500);

  const saveNote = (noteData, existingNote) => {
    return debouncedSave(noteData, existingNote);
  };

  const togglePin = async (noteId) => {
    try {
      const noteToUpdate = notes.find(note => note.id === noteId);
      if (!noteToUpdate) {
        throw new AppError('Note not found', StatusCodes.NOT_FOUND);
      }
      
      await updateDoc(doc(db, 'notes', noteId), {
        pinned: !noteToUpdate.pinned,
        timestamp: serverTimestamp()
      });
      
      toast.success(noteToUpdate.pinned ? 'Note unpinned' : 'Note pinned');
      await fetchNotes();
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const deleteNote = async (noteId) => {
    try {
      const noteRef = doc(db, 'notes', noteId);
      await deleteDoc(noteRef);
      toast.success('Note deleted successfully');
      await fetchNotes();
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw new AppError('Failed to delete note', StatusCodes.INTERNAL_SERVER_ERROR);
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