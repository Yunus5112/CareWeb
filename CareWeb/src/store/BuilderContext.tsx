import React, { createContext, useContext, useReducer, useCallback, type ReactNode } from 'react';
import type {
  Element,
  CanvasState,
  SelectionState,
  DragState,
  HistoryState,
  ProjectState,
  Result,
  AppError,
} from '../types';
import {
  ElementType,
  ViewportMode,
  VIEWPORT_SIZES,
  createImportError,
  createParseError,
  fromUnknownError,
} from '../types';
import { validateProjectJSON } from '../utils';
import { ElementFactory } from '../services/ElementFactory';
import { Ok, Err } from '../types/result';

// Builder State Interface
interface BuilderState {
  elements: Element[];
  canvas: CanvasState;
  selection: SelectionState;
  drag: DragState;
  history: HistoryState;
  project: ProjectState;
}

// Action Types
type BuilderAction =
  | { type: 'ADD_ELEMENT'; payload: Element }
  | { type: 'REMOVE_ELEMENT'; payload: string }
  | { type: 'UPDATE_ELEMENT'; payload: { id: string; updates: Partial<Element> } }
  | { type: 'SET_ELEMENTS'; payload: Element[] }
  | { type: 'SELECT_ELEMENT'; payload: { id: string; multiSelect: boolean } }
  | { type: 'DESELECT_ALL' }
  | { type: 'START_DRAG'; payload: { elementType?: ElementType; elementId?: string; dragType: 'new-element' | 'existing-element' } }
  | { type: 'UPDATE_DRAG_POSITION'; payload: { x: number; y: number } }
  | { type: 'END_DRAG' }
  | { type: 'SET_VIEWPORT_MODE'; payload: ViewportMode }
  | { type: 'SET_ZOOM'; payload: number }
  | { type: 'UNDO' }
  | { type: 'REDO' }
  | { type: 'UPDATE_PROJECT_METADATA'; payload: Partial<ProjectState['metadata']> }
  | { type: 'MARK_SAVED' }
  | { type: 'MARK_UNSAVED' };

// Initial State
const initialState: BuilderState = {
  elements: [],
  canvas: {
    config: {
      width: 1200,
      height: 800,
      grid: {
        enabled: true,
        size: 10,
        snap: true,
        showGrid: false
      },
      backgroundColor: '#f5f5f5',
      padding: 20
    },
    viewportMode: ViewportMode.DESKTOP,
    zoom: 1,
    panOffset: { x: 0, y: 0 }
  },
  selection: {
    selectedElementIds: [],
    multiSelect: false,
    showHandles: false
  },
  drag: {
    isDragging: false,
    draggedElementType: null,
    draggedElementId: null,
    dragType: null,
    dragPreviewPosition: null
  },
  history: {
    past: [],
    future: [],
    maxHistoryLength: 50
  },
  project: {
    metadata: {
      name: 'Untitled Project',
      version: '1.0',
      created: new Date().toISOString(),
      lastModified: new Date().toISOString()
    },
    isSaved: true,
    hasUnsavedChanges: false
  }
};

// Reducer
const builderReducer = (state: BuilderState, action: BuilderAction): BuilderState => {
  switch (action.type) {
    case 'ADD_ELEMENT':
      return {
        ...state,
        elements: [...state.elements, action.payload],
        project: {
          ...state.project,
          hasUnsavedChanges: true,
          metadata: {
            ...state.project.metadata,
            lastModified: new Date().toISOString()
          }
        }
      };

    case 'REMOVE_ELEMENT':
      return {
        ...state,
        elements: state.elements.filter(el => el.id !== action.payload),
        selection: {
          ...state.selection,
          selectedElementIds: state.selection.selectedElementIds.filter(id => id !== action.payload)
        },
        project: {
          ...state.project,
          hasUnsavedChanges: true,
          metadata: {
            ...state.project.metadata,
            lastModified: new Date().toISOString()
          }
        }
      };

    case 'UPDATE_ELEMENT':
      return {
        ...state,
        elements: state.elements.map(el =>
          el.id === action.payload.id
            ? { ...el, ...action.payload.updates, updatedAt: new Date().toISOString() }
            : el
        ),
        project: {
          ...state.project,
          hasUnsavedChanges: true,
          metadata: {
            ...state.project.metadata,
            lastModified: new Date().toISOString()
          }
        }
      };

    case 'SET_ELEMENTS':
      return {
        ...state,
        elements: action.payload
      };

    case 'SELECT_ELEMENT':
      if (action.payload.multiSelect) {
        const isSelected = state.selection.selectedElementIds.includes(action.payload.id);
        return {
          ...state,
          selection: {
            ...state.selection,
            multiSelect: true,
            showHandles: true,
            selectedElementIds: isSelected
              ? state.selection.selectedElementIds.filter(id => id !== action.payload.id)
              : [...state.selection.selectedElementIds, action.payload.id]
          }
        };
      } else {
        return {
          ...state,
          selection: {
            selectedElementIds: [action.payload.id],
            multiSelect: false,
            showHandles: true
          }
        };
      }

    case 'DESELECT_ALL':
      return {
        ...state,
        selection: {
          selectedElementIds: [],
          multiSelect: false,
          showHandles: false
        }
      };

    case 'START_DRAG':
      return {
        ...state,
        drag: {
          isDragging: true,
          draggedElementType: action.payload.elementType || null,
          draggedElementId: action.payload.elementId || null,
          dragType: action.payload.dragType,
          dragPreviewPosition: null
        }
      };

    case 'UPDATE_DRAG_POSITION':
      return {
        ...state,
        drag: {
          ...state.drag,
          dragPreviewPosition: action.payload
        }
      };

    case 'END_DRAG':
      return {
        ...state,
        drag: {
          isDragging: false,
          draggedElementType: null,
          draggedElementId: null,
          dragType: null,
          dragPreviewPosition: null
        }
      };

    case 'SET_VIEWPORT_MODE':
      return {
        ...state,
        canvas: {
          ...state.canvas,
          viewportMode: action.payload,
          config: {
            ...state.canvas.config,
            width: VIEWPORT_SIZES[action.payload].width,
            height: VIEWPORT_SIZES[action.payload].height
          }
        }
      };

    case 'SET_ZOOM':
      return {
        ...state,
        canvas: {
          ...state.canvas,
          zoom: Math.max(0.25, Math.min(2, action.payload))
        }
      };

    case 'UPDATE_PROJECT_METADATA':
      return {
        ...state,
        project: {
          ...state.project,
          metadata: {
            ...state.project.metadata,
            ...action.payload,
            lastModified: new Date().toISOString()
          }
        }
      };

    case 'MARK_SAVED':
      return {
        ...state,
        project: {
          ...state.project,
          isSaved: true,
          hasUnsavedChanges: false
        }
      };

    case 'MARK_UNSAVED':
      return {
        ...state,
        project: {
          ...state.project,
          hasUnsavedChanges: true
        }
      };

    default:
      return state;
  }
};

// Context
interface BuilderContextType {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
  
  // Helper methods
  addElement: (type: ElementType, position?: { x: number; y: number }) => void;
  removeElement: (id: string) => void;
  updateElement: (id: string, updates: Partial<Element>) => void;
  selectElement: (id: string, multiSelect?: boolean) => void;
  deselectAll: () => void;
  setViewportMode: (mode: ViewportMode) => void;
  exportJSON: () => Result<string, AppError>;
  importJSON: (json: string) => Result<void, AppError>;
}

const BuilderContext = createContext<BuilderContextType | undefined>(undefined);

// Provider
export const BuilderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(builderReducer, initialState);

  const addElement = useCallback((type: ElementType, position?: { x: number; y: number }) => {
    // ✅ Type-safe element creation using ElementFactory
    const newElement = ElementFactory.createElement(type, position);
    dispatch({ type: 'ADD_ELEMENT', payload: newElement });
  }, []);

  const removeElement = useCallback((id: string) => {
    dispatch({ type: 'REMOVE_ELEMENT', payload: id });
  }, []);

  const updateElement = useCallback((id: string, updates: Partial<Element>) => {
    dispatch({ type: 'UPDATE_ELEMENT', payload: { id, updates } });
  }, []);

  const selectElement = useCallback((id: string, multiSelect = false) => {
    dispatch({ type: 'SELECT_ELEMENT', payload: { id, multiSelect } });
  }, []);

  const deselectAll = useCallback(() => {
    dispatch({ type: 'DESELECT_ALL' });
  }, []);

  const setViewportMode = useCallback((mode: ViewportMode) => {
    dispatch({ type: 'SET_VIEWPORT_MODE', payload: mode });
  }, []);

  const exportJSON = useCallback((): Result<string, AppError> => {
    try {
      const projectData = {
        project: state.project.metadata,
        canvas: state.canvas.config,
        elements: state.elements,
        metadata: {
          totalElements: state.elements.length,
          exportFormat: 'json',
          exportVersion: '2.0'
        }
      };
      
      const jsonString = JSON.stringify(projectData, null, 2);
      return Ok(jsonString);
    } catch (error) {
      return Err(fromUnknownError(error));
    }
  }, [state]);

  const importJSON = useCallback((json: string): Result<void, AppError> => {
    try {
      // Step 1: Parse JSON
      let data: any;
      try {
        data = JSON.parse(json);
      } catch (parseError) {
        return Err(createParseError('Invalid JSON format. Please check your file.'));
      }
      
      // Step 2: Validate structure
      const validation = validateProjectJSON(data);
      if (!validation.valid) {
        return Err(createImportError(
          'JSON validation failed',
          validation.errors
        ));
      }
      
      // Step 3: Import data
      dispatch({ type: 'SET_ELEMENTS', payload: data.elements || [] });
      
      if (data.project) {
        dispatch({ type: 'UPDATE_PROJECT_METADATA', payload: data.project });
      }
      
      if (data.canvas) {
        // Update canvas config if provided
        dispatch({ type: 'SET_VIEWPORT_MODE', payload: ViewportMode.DESKTOP });
      }
      
      dispatch({ type: 'MARK_SAVED' });
      
      return Ok(undefined);
    } catch (error) {
      return Err(fromUnknownError(error));
    }
  }, []);

  const value: BuilderContextType = {
    state,
    dispatch,
    addElement,
    removeElement,
    updateElement,
    selectElement,
    deselectAll,
    setViewportMode,
    exportJSON,
    importJSON
  };

  return <BuilderContext.Provider value={value}>{children}</BuilderContext.Provider>;
};

// Hook
export const useBuilder = () => {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error('useBuilder must be used within BuilderProvider');
  }
  return context;
};

