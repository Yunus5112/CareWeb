import { ElementType } from '../types';

/**
 * Generate unique element ID
 */
export const generateElementId = (type: ElementType): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  const typePrefix = type.replace('-', '_');
  
  return `elem_${typePrefix}_${timestamp}_${random}`;
};

/**
 * Generate unique history entry ID
 */
export const generateHistoryId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  
  return `history_${timestamp}_${random}`;
};

/**
 * Generate project ID
 */
export const generateProjectId = (): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 15);
  
  return `project_${timestamp}_${random}`;
};

