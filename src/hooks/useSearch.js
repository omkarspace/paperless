import Fuse from 'fuse.js';
import { useMemo } from 'react';

export function useSearch(items, searchTerm) {
  const fuse = useMemo(() => {
    return new Fuse(items, {
      keys: ['title', 'tagline', 'body', 'category'],
      threshold: 0.3,
    });
  }, [items]);

  const results = useMemo(() => {
    if (!searchTerm) return items;
    return fuse.search(searchTerm).map(result => result.item);
  }, [fuse, items, searchTerm]);

  return results;
}