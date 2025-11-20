import { useEffect } from 'react';
import { useBuilder } from '../store/BuilderContext';

export const useKeyboardShortcuts = () => {
  const { state, removeElement, deselectAll } = useBuilder();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Input, textarea veya contenteditable içindeyken klavye kısayollarını devre dışı bırak
      const target = e.target as HTMLElement;
      const isInputField = 
        target.tagName === 'INPUT' || 
        target.tagName === 'TEXTAREA' || 
        target.isContentEditable ||
        target.closest('input') !== null ||
        target.closest('textarea') !== null;
      
      // Input alanındayken sadece Escape'i çalıştır (blur için)
      if (isInputField) {
        if (e.key === 'Escape') {
          (target as HTMLInputElement).blur();
          deselectAll();
        }
        return; // Diğer kısayolları engelle
      }

      // Delete selected elements (sadece input dışında)
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selection.selectedElementIds.length > 0) {
        e.preventDefault();
        state.selection.selectedElementIds.forEach(id => {
          removeElement(id);
        });
      }

      // Deselect all (Escape)
      if (e.key === 'Escape') {
        deselectAll();
      }

      // Select all (Cmd/Ctrl + A)
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault();
        // TODO: Implement select all
      }

      // Copy (Cmd/Ctrl + C)
      if ((e.metaKey || e.ctrlKey) && e.key === 'c' && state.selection.selectedElementIds.length > 0) {
        e.preventDefault();
        // TODO: Implement copy
        console.log('Copy:', state.selection.selectedElementIds);
      }

      // Paste (Cmd/Ctrl + V)
      if ((e.metaKey || e.ctrlKey) && e.key === 'v') {
        e.preventDefault();
        // TODO: Implement paste
        console.log('Paste');
      }

      // Undo (Cmd/Ctrl + Z)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        // TODO: Implement undo
        console.log('Undo');
      }

      // Redo (Cmd/Ctrl + Shift + Z)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        // TODO: Implement redo
        console.log('Redo');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selection.selectedElementIds, removeElement, deselectAll, state]);
};

