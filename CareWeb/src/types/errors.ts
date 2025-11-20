/**
 * Application error types
 * Structured error handling for better debugging and user feedback
 */

export enum ErrorType {
  // Validation errors
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INVALID_JSON = 'INVALID_JSON',
  INVALID_ELEMENT = 'INVALID_ELEMENT',
  
  // Import/Export errors
  IMPORT_ERROR = 'IMPORT_ERROR',
  EXPORT_ERROR = 'EXPORT_ERROR',
  PARSE_ERROR = 'PARSE_ERROR',
  
  // Element operation errors
  ELEMENT_NOT_FOUND = 'ELEMENT_NOT_FOUND',
  ELEMENT_CREATION_FAILED = 'ELEMENT_CREATION_FAILED',
  ELEMENT_UPDATE_FAILED = 'ELEMENT_UPDATE_FAILED',
  
  // Canvas errors
  COLLISION_DETECTED = 'COLLISION_DETECTED',
  OUT_OF_BOUNDS = 'OUT_OF_BOUNDS',
  
  // Generic errors
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  OPERATION_FAILED = 'OPERATION_FAILED',
}

export interface AppError {
  type: ErrorType;
  message: string;
  details?: string[];
  code?: string;
  timestamp?: string;
}

/**
 * Create a validation error
 */
export const createValidationError = (
  message: string,
  details?: string[]
): AppError => ({
  type: ErrorType.VALIDATION_ERROR,
  message,
  details,
  timestamp: new Date().toISOString(),
});

/**
 * Create an import error
 */
export const createImportError = (
  message: string,
  details?: string[]
): AppError => ({
  type: ErrorType.IMPORT_ERROR,
  message,
  details,
  timestamp: new Date().toISOString(),
});

/**
 * Create a parse error
 */
export const createParseError = (message: string): AppError => ({
  type: ErrorType.PARSE_ERROR,
  message,
  timestamp: new Date().toISOString(),
});

/**
 * Create an element error
 */
export const createElementError = (
  type: ErrorType,
  message: string
): AppError => ({
  type,
  message,
  timestamp: new Date().toISOString(),
});

/**
 * Create a generic error from unknown error
 */
export const fromUnknownError = (error: unknown): AppError => {
  if (error instanceof Error) {
    return {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message,
      details: [error.stack || ''],
      timestamp: new Date().toISOString(),
    };
  }
  
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: String(error),
    timestamp: new Date().toISOString(),
  };
};

/**
 * Format error for user display
 */
export const formatErrorMessage = (error: AppError): string => {
  let message = error.message;
  
  if (error.details && error.details.length > 0) {
    message += '\n\nDetails:\n' + error.details.map(d => `• ${d}`).join('\n');
  }
  
  return message;
};

/**
 * Check if error is of specific type
 */
export const isErrorType = (error: AppError, type: ErrorType): boolean => {
  return error.type === type;
};

