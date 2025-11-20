import { Element } from './elements';

// History Action Types
export enum HistoryActionType {
  ADD_ELEMENT = 'ADD_ELEMENT',
  REMOVE_ELEMENT = 'REMOVE_ELEMENT',
  UPDATE_ELEMENT = 'UPDATE_ELEMENT',
  MOVE_ELEMENT = 'MOVE_ELEMENT',
  RESIZE_ELEMENT = 'RESIZE_ELEMENT',
  UPDATE_Z_INDEX = 'UPDATE_Z_INDEX',
  BATCH_UPDATE = 'BATCH_UPDATE'
}

// History Entry
export interface HistoryEntry {
  id: string;
  type: HistoryActionType;
  timestamp: string;
  data: {
    elementId?: string;
    elementIds?: string[];
    before?: Partial<Element> | Element[];
    after?: Partial<Element> | Element[];
  };
}

// History State
export interface HistoryState {
  past: HistoryEntry[];
  future: HistoryEntry[];
  maxHistoryLength: number;
}

