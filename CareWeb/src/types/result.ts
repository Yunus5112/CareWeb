/**
 * Result type for error handling
 * Inspired by Rust's Result<T, E>
 */

export type Result<T, E = Error> = Success<T> | Failure<E>;

export interface Success<T> {
  success: true;
  data: T;
}

export interface Failure<E> {
  success: false;
  error: E;
}

/**
 * Helper functions for Result type
 */
export const Ok = <T>(data: T): Success<T> => ({
  success: true,
  data,
});

export const Err = <E>(error: E): Failure<E> => ({
  success: false,
  error,
});

/**
 * Check if result is successful
 */
export const isOk = <T, E>(result: Result<T, E>): result is Success<T> => {
  return result.success === true;
};

/**
 * Check if result is failure
 */
export const isErr = <T, E>(result: Result<T, E>): result is Failure<E> => {
  return result.success === false;
};

/**
 * Unwrap result value or throw error
 */
export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isOk(result)) {
    return result.data;
  }
  throw result.error;
};

/**
 * Unwrap result value or return default
 */
export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T => {
  if (isOk(result)) {
    return result.data;
  }
  return defaultValue;
};

/**
 * Map over successful result
 */
export const mapResult = <T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> => {
  if (isOk(result)) {
    return Ok(fn(result.data));
  }
  return result;
};

/**
 * Map over error result
 */
export const mapError = <T, E, F>(
  result: Result<T, E>,
  fn: (error: E) => F
): Result<T, F> => {
  if (isErr(result)) {
    return Err(fn(result.error));
  }
  return result;
};

