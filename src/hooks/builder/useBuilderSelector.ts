/**
 * Builder Selector Hooks
 * Memoized selectors to prevent unnecessary re-renders
 * Performance optimization
 */

import { useMemo } from 'react';
import { useBuilder } from '../../store/BuilderContext';
import type { Element } from '../../types';

/**
 * Get the currently selected element (single selection only)
 */
export const useSelectedElement = (): Element | null => {
  const { state } = useBuilder();
  
  return useMemo(() => {
    if (state.selection.selectedElementIds.length !== 1) {
      return null;
    }
    
    const selectedId = state.selection.selectedElementIds[0];
    return state.elements.find(el => el.id === selectedId) || null;
  }, [state.selection.selectedElementIds, state.elements]);
};

/**
 * Get all selected elements (multi-selection support)
 */
export const useSelectedElements = (): Element[] => {
  const { state } = useBuilder();
  
  return useMemo(() => {
    return state.elements.filter(el =>
      state.selection.selectedElementIds.includes(el.id)
    );
  }, [state.selection.selectedElementIds, state.elements]);
};

/**
 * Check if a specific element is selected
 */
export const useIsElementSelected = (elementId: string): boolean => {
  const { state } = useBuilder();
  
  return useMemo(() => {
    return state.selection.selectedElementIds.includes(elementId);
  }, [state.selection.selectedElementIds, elementId]);
};

/**
 * Get element by ID
 */
export const useElementById = (elementId: string): Element | undefined => {
  const { state } = useBuilder();
  
  return useMemo(() => {
    return state.elements.find(el => el.id === elementId);
  }, [state.elements, elementId]);
};

/**
 * Get canvas configuration
 */
export const useCanvasConfig = () => {
  const { state } = useBuilder();
  
  return useMemo(() => ({
    width: state.canvas.config.width,
    height: state.canvas.config.height,
    zoom: state.canvas.zoom,
    viewportMode: state.canvas.viewportMode,
    grid: state.canvas.config.grid,
  }), [state.canvas]);
};

/**
 * Get selection state
 */
export const useSelectionState = () => {
  const { state } = useBuilder();
  
  return useMemo(() => ({
    selectedIds: state.selection.selectedElementIds,
    count: state.selection.selectedElementIds.length,
    isMultiSelect: state.selection.multiSelect,
    hasSelection: state.selection.selectedElementIds.length > 0,
  }), [state.selection]);
};

/**
 * Get drag state
 */
export const useDragState = () => {
  const { state } = useBuilder();
  
  return useMemo(() => ({
    isDragging: state.drag.isDragging,
    draggedElementType: state.drag.draggedElementType,
    draggedElementId: state.drag.draggedElementId,
    dragType: state.drag.dragType,
    dragPreviewPosition: state.drag.dragPreviewPosition,
  }), [state.drag]);
};

/**
 * Get project metadata
 */
export const useProjectMetadata = () => {
  const { state } = useBuilder();
  
  return useMemo(() => ({
    name: state.project.metadata.name,
    version: state.project.metadata.version,
    created: state.project.metadata.created,
    lastModified: state.project.metadata.lastModified,
    hasUnsavedChanges: state.project.hasUnsavedChanges,
    isSaved: state.project.isSaved,
  }), [state.project]);
};

/**
 * Get elements count
 */
export const useElementsCount = (): number => {
  const { state } = useBuilder();
  
  return useMemo(() => {
    return state.elements.length;
  }, [state.elements.length]);
};

