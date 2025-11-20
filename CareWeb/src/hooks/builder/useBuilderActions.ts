/**
 * Builder Action Hooks
 * Convenience hooks for common builder actions
 */

import { useCallback } from 'react';
import { useBuilder } from '../../store/BuilderContext';
import { ElementType } from '../../types';

/**
 * Element manipulation actions
 */
export const useElementActions = () => {
  const { addElement, removeElement, updateElement, selectElement, deselectAll } = useBuilder();
  
  const createElement = useCallback(
    (type: ElementType, position?: { x: number; y: number }) => {
      addElement(type, position);
    },
    [addElement]
  );
  
  const deleteElement = useCallback(
    (id: string) => {
      removeElement(id);
    },
    [removeElement]
  );
  
  const updateElementPosition = useCallback(
    (id: string, x: number, y: number) => {
      updateElement(id, {
        position: {
          x,
          y,
        } as any, // Will be merged with existing position
      });
    },
    [updateElement]
  );
  
  const updateElementSize = useCallback(
    (id: string, width: number, height: number) => {
      updateElement(id, {
        position: {
          width,
          height,
        } as any,
      });
    },
    [updateElement]
  );
  
  const selectSingleElement = useCallback(
    (id: string) => {
      selectElement(id, false);
    },
    [selectElement]
  );
  
  const toggleElementSelection = useCallback(
    (id: string) => {
      selectElement(id, true);
    },
    [selectElement]
  );
  
  const clearSelection = useCallback(() => {
    deselectAll();
  }, [deselectAll]);
  
  return {
    createElement,
    deleteElement,
    updateElementPosition,
    updateElementSize,
    selectSingleElement,
    toggleElementSelection,
    clearSelection,
  };
};

/**
 * Viewport actions
 */
export const useViewportActions = () => {
  const { setViewportMode } = useBuilder();
  
  return {
    setViewportMode,
  };
};

/**
 * Project actions
 */
export const useProjectActions = () => {
  const { exportJSON, importJSON } = useBuilder();
  
  const exportProject = useCallback(() => {
    return exportJSON();
  }, [exportJSON]);
  
  const importProject = useCallback(
    (json: string) => {
      importJSON(json);
    },
    [importJSON]
  );
  
  return {
    exportProject,
    importProject,
  };
};

