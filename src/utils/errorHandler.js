import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
  constructor(message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    Error.captureStackTrace(this, this.constructor);
  }
}

export const getErrorMessage = (error) => {
  if (error.code) {
    switch (error.code) {
      case 'permission-denied':
        return 'You don\'t have permission to perform this action';
      case 'not-found':
        return 'The requested resource was not found';
      case 'already-exists':
        return 'This resource already exists';
      case 'resource-exhausted':
        return 'You\'ve reached the maximum limit for this operation';
      case 'failed-precondition':
        return 'The operation failed due to a conflict with the current state';
      case 'cancelled':
        return 'The operation was cancelled';
      case 'data-loss':
        return 'Unrecoverable data loss or corruption';
      case 'unauthenticated':
        return 'Authentication is required for this operation';
      default:
        return error.message || 'An unexpected error occurred';
    }
  }
  return error.message || 'An unexpected error occurred';
};