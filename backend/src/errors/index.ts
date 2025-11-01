// Custom error classes for better error handling

export class UserAlreadyExistsError extends Error {
  constructor(message: string = 'User already exists') {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

export class UserNotFoundError extends Error {
  constructor(message: string = 'User not found') {
    super(message);
    this.name = 'UserNotFoundError';
  }
}

export class InvalidPasswordError extends Error {
  constructor(message: string = 'Invalid password') {
    super(message);
    this.name = 'InvalidPasswordError';
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class ValidationError extends Error {
  constructor(message: string = 'Validation error') {
    super(message);
    this.name = 'ValidationError';
  }
}
