import { useState, useEffect } from 'react';
import { INITIAL_MEMORIES } from '../data/defaultMemories';

const STORAGE_KEY = 'human_experience_memories_v13';

export function useMemories() {
  const [memories, setMemories] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          // Replace default items with updated INITIAL_MEMORIES definitions
          const customOnly = parsed.filter(m => m.id.startsWith('mem-custom'));
          return sortChronologically([...INITIAL_MEMORIES, ...customOnly]);
        }
      }
    } catch (e) {
      console.warn('Failed to parse memories from localStorage', e);
    }
    return sortChronologically(INITIAL_MEMORIES);
  });

  const [highlightedId, setHighlightedId] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    } catch (e) {
      console.error('Failed to save memories to localStorage', e);
    }
  }, [memories]);

  function sortChronologically(list) {
    return [...list].sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  function addMemory(newMem) {
    const formatted = {
      ...newMem,
      id: newMem.id || `mem-custom-${Date.now()}`,
      displayDate: newMem.displayDate || formatDate(newMem.date),
      positionHint: newMem.positionHint || getRandomLayout()
    };
    setMemories(prev => sortChronologically([...prev, formatted]));
    return formatted.id;
  }

  function highlightMemory(id) {
    setHighlightedId(id);
    setTimeout(() => {
      setHighlightedId(prev => (prev === id ? null : prev));
    }, 3200);
  }

  function deleteMedia(memoryId, mediaIndex) {
    setMemories(prev => {
      const updated = prev.map(mem => {
        if (mem.id !== memoryId) return mem;
        const newMedia = (mem.media || []).filter((_, idx) => idx !== mediaIndex);
        return {
          ...mem,
          media: newMedia
        };
      }).filter(mem => mem.media.length > 0);
      return sortChronologically(updated);
    });
  }

  function deleteMemory(memoryId) {
    setMemories(prev => prev.filter(mem => mem.id !== memoryId));
  }

  function resetMemories() {
    setMemories(sortChronologically(INITIAL_MEMORIES));
    localStorage.removeItem(STORAGE_KEY);
  }

  return {
    memories,
    addMemory,
    deleteMedia,
    deleteMemory,
    highlightedId,
    highlightMemory,
    resetMemories
  };
}

function formatDate(isoString) {
  if (!isoString) return '';
  const [year, month, day] = isoString.split('-');
  const dateObj = new Date(year, parseInt(month) - 1, day);
  return dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function getRandomLayout() {
  const layouts = ['left', 'right', 'center', 'staggered-duo'];
  return layouts[Math.floor(Math.random() * layouts.length)];
}
