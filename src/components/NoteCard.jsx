import { memo } from 'react';
import { format } from 'date-fns';
import { StarIcon as StarOutline, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';
import { motion } from 'framer-motion';

const NoteCard = memo(({ note, onPin, onClick, onDelete }) => {
  const cardColors = [
    'bg-white dark:bg-gray-800',
    'bg-yellow-50 dark:bg-yellow-900/20',
    'bg-green-50 dark:bg-green-900/20',
    'bg-blue-50 dark:bg-blue-900/20',
    'bg-purple-50 dark:bg-purple-900/20',
    'bg-pink-50 dark:bg-pink-900/20'
  ];

  const randomColor = cardColors[note.id.charCodeAt(0) % cardColors.length];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`${randomColor} rounded-lg shadow-lg p-4 cursor-pointer transition-shadow hover:shadow-xl break-inside-avoid mb-4`}
      role="article"
      aria-label={`Note: ${note.title}`}
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick();
        }
      }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate flex-1">
          {note.title}
        </h3>
        <div className="flex gap-2 ml-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPin(note.id);
            }}
            className="text-yellow-500 hover:text-yellow-600 dark:text-yellow-400 dark:hover:text-yellow-300 transition-colors"
            aria-label={note.pinned ? 'Unpin note' : 'Pin note'}
          >
            {note.pinned ? (
              <StarSolid className="h-5 w-5" />
            ) : (
              <StarOutline className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note.id);
            }}
            className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors"
            aria-label="Delete note"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {note.tagline && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{note.tagline}</p>
      )}
      <p className="text-gray-700 dark:text-gray-300 line-clamp-3 whitespace-pre-wrap">
        {note.body}
      </p>
      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        {format(note.timestamp.toDate(), 'MMM d, yyyy • h:mm a')}
      </div>
    </motion.div>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.note.id === nextProps.note.id &&
    prevProps.note.title === nextProps.note.title &&
    prevProps.note.tagline === nextProps.note.tagline &&
    prevProps.note.body === nextProps.note.body &&
    prevProps.note.pinned === nextProps.note.pinned &&
    prevProps.note.timestamp === nextProps.note.timestamp
  );
});

NoteCard.displayName = 'NoteCard';

export default NoteCard;