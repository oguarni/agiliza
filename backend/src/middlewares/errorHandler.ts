import { Request, Response, NextFunction } from 'express';
import {
  UserAlreadyExistsError,
  UserNotFoundError,
  InvalidPasswordError,
  AuthorizationError,
  ValidationError,
} from '../errors';

// Error response interface
interface ErrorResponse {
  error: string;
  message: string;
  status: number;
}

/**
 * Central error handling middleware
 * Catches errors thrown by services and sends appropriate HTTP responses
 */
const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  let statusCode = 500;
  let message = err.message || 'Internal server error';

  // Map custom errors to HTTP status codes
  if (err instanceof UserAlreadyExistsError) {
    statusCode = 409; // Conflict
  } else if (err instanceof UserNotFoundError) {
    statusCode = 404; // Not Found
  } else if (err instanceof InvalidPasswordError) {
    statusCode = 401; // Unauthorized
  } else if (err instanceof AuthorizationError) {
    statusCode = 403; // Forbidden
  } else if (err instanceof ValidationError) {
    statusCode = 400; // Bad Request
  }

  const errorResponse: ErrorResponse = {
    error: err.name || 'Error',
    message,
    status: statusCode,
  };

  res.status(statusCode).json(errorResponse);
};

export default errorHandler;
