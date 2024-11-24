import { memo } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';
import NoteCard from './NoteCard';

const ROW_HEIGHT = 300;
const ITEMS_PER_ROW = 3;

const VirtualizedNoteGrid = memo(({ notes, onPin, onDelete, onNoteClick }) => {
  const getItemKey = (index) => {
    const startIdx = index * ITEMS_PER_ROW;
    const notesInRow = notes.slice(startIdx, startIdx + ITEMS_PER_ROW);
    return notesInRow.map(note => note.id).join('-');
  };

  const Row = ({ index, style }) => {
    const startIdx = index * ITEMS_PER_ROW;
    const notesInRow = notes.slice(startIdx, startIdx + ITEMS_PER_ROW);

    return (
      <div style={style} className="flex gap-4">
        {notesInRow.map((note) => (
          <div key={note.id} className="flex-1 min-w-0">
            <NoteCard
              note={note}
              onPin={onPin}
              onDelete={onDelete}
              onClick={() => onNoteClick(note)}
            />
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="h-[calc(100vh-200px)]">
      <AutoSizer>
        {({ height, width }) => (
          <List
            height={height}
            itemCount={Math.ceil(notes.length / ITEMS_PER_ROW)}
            itemSize={ROW_HEIGHT}
            width={width}
            itemKey={getItemKey}
          >
            {Row}
          </List>
        )}
      </AutoSizer>
    </div>
  );
});

VirtualizedNoteGrid.displayName = 'VirtualizedNoteGrid';

export default VirtualizedNoteGrid;