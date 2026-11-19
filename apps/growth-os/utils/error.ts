/**
 * Centralized error handling utilities.
 * Never let raw errors propagate to the UI.
 */

export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = "UNKNOWN_ERROR",
    public readonly statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    super(
      id ? `${resource} with id "${id}" not found.` : `${resource} not found.`,
      "NOT_FOUND",
      404
    );
    this.name = "NotFoundError";
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, "VALIDATION_ERROR", 422);
    this.name = "ValidationError";
  }
}

export class UnauthorizedError extends AppError {
  constructor() {
    super("Unauthorized. Please log in.", "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

/**
 * Safely extract a human-readable error message from any thrown value.
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AppError) return error.message;
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred.";
}

/**
 * Log an error with context. Replace with a proper logger (Sentry, etc.) later.
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  console.error("[Gearbox Error]", {
    message: getErrorMessage(error),
    error,
    context,
    timestamp: new Date().toISOString(),
  });
}
