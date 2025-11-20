import type { Element } from './elements';
import type { CanvasConfig } from './canvas';

// Project Metadata
export interface ProjectMetadata {
  name: string;
  version: string;
  created: string;
  lastModified: string;
  author?: string;
  description?: string;
}

// Complete Project Structure (JSON Export Format)
export interface Project {
  project: ProjectMetadata;
  canvas: CanvasConfig;
  elements: Element[];
  metadata: {
    totalElements: number;
    exportFormat: string;
    exportVersion: string;
  };
}

// Project State
export interface ProjectState {
  metadata: ProjectMetadata;
  isSaved: boolean;
  hasUnsavedChanges: boolean;
}

