import { format } from 'date-fns';
import { StarIcon as StarOutline, TrashIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolid } from '@heroicons/react/24/solid';

export default function NoteCard({ note, onPin, onClick, onDelete }) {
  const cardColors = [
    'bg-white',
    'bg-yellow-50',
    'bg-green-50',
    'bg-blue-50',
    'bg-purple-50',
    'bg-pink-50'
  ];

  const randomColor = cardColors[note.id.charCodeAt(0) % cardColors.length];

  return (
    <div 
      onClick={onClick}
      className={`${randomColor} rounded-lg shadow-lg p-4 cursor-pointer transform transition hover:scale-102 hover:shadow-xl break-inside-avoid mb-4`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">{note.title}</h3>
        <div className="flex gap-2 ml-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onPin(note.id);
            }}
            className="text-yellow-500 hover:text-yellow-600 transition-colors"
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
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      {note.tagline && (
        <p className="text-sm text-gray-600 mb-2">{note.tagline}</p>
      )}
      <p className="text-gray-700 line-clamp-3 whitespace-pre-wrap">{note.body}</p>
      <div className="mt-4 text-xs text-gray-500">
        {format(note.timestamp.toDate(), 'MMM d, yyyy • h:mm a')}
      </div>
    </div>
  );
}