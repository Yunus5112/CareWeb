import { Project, Element, ElementType } from '../types';

/**
 * Validate Project JSON structure
 */
export const validateProjectJSON = (data: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check required top-level properties
  if (!data.project) errors.push('Missing "project" property');
  if (!data.canvas) errors.push('Missing "canvas" property');
  if (!data.elements) errors.push('Missing "elements" property');
  if (!data.metadata) errors.push('Missing "metadata" property');
  
  // Validate project metadata
  if (data.project) {
    if (!data.project.name) errors.push('Missing project.name');
    if (!data.project.version) errors.push('Missing project.version');
    if (!data.project.created) errors.push('Missing project.created');
    if (!data.project.lastModified) errors.push('Missing project.lastModified');
  }
  
  // Validate canvas
  if (data.canvas) {
    if (typeof data.canvas.width !== 'number') errors.push('Invalid canvas.width');
    if (typeof data.canvas.height !== 'number') errors.push('Invalid canvas.height');
    if (!data.canvas.grid) errors.push('Missing canvas.grid');
  }
  
  // Validate elements array
  if (data.elements) {
    if (!Array.isArray(data.elements)) {
      errors.push('elements must be an array');
    } else {
      data.elements.forEach((element: any, index: number) => {
        if (!element.id) errors.push(`Element ${index}: missing id`);
        if (!element.type) errors.push(`Element ${index}: missing type`);
        if (!Object.values(ElementType).includes(element.type)) {
          errors.push(`Element ${index}: invalid type "${element.type}"`);
        }
        if (!element.position) errors.push(`Element ${index}: missing position`);
        if (!element.content) errors.push(`Element ${index}: missing content`);
      });
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Validate element structure
 */
export const validateElement = (element: any): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!element.id) errors.push('Missing id');
  if (!element.type) errors.push('Missing type');
  if (!element.position) errors.push('Missing position');
  if (!element.content) errors.push('Missing content');
  
  // Validate position
  if (element.position) {
    if (element.position.x === undefined) errors.push('Missing position.x');
    if (element.position.y === undefined) errors.push('Missing position.y');
    if (element.position.width === undefined) errors.push('Missing position.width');
    if (element.position.height === undefined) errors.push('Missing position.height');
    if (typeof element.position.zIndex !== 'number') errors.push('Invalid position.zIndex');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize imported project data
 */
export const sanitizeProjectData = (data: any): Project | null => {
  const validation = validateProjectJSON(data);
  
  if (!validation.valid) {
    console.error('Project validation errors:', validation.errors);
    return null;
  }
  
  return data as Project;
};

