import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { ApiErrorResponse, ApiSuccessResponse } from "@gearbox/types/database";

export class AppError extends Error {
  constructor(
    public readonly code: string,
    message: string,
    public readonly statusCode: number = 500,
    public readonly details?: unknown
  ) {
    super(message);
    this.name = "AppError";
  }

  static badRequest(message: string, details?: unknown): AppError {
    return new AppError("BAD_REQUEST", message, 400, details);
  }

  static unauthorized(message = "Unauthorized"): AppError {
    return new AppError("UNAUTHORIZED", message, 401);
  }

  static forbidden(message = "Forbidden"): AppError {
    return new AppError("FORBIDDEN", message, 403);
  }

  static notFound(message = "Resource not found"): AppError {
    return new AppError("NOT_FOUND", message, 404);
  }

  static conflict(message: string, details?: unknown): AppError {
    return new AppError("CONFLICT", message, 409, details);
  }

  static unprocessable(message: string, details?: unknown): AppError {
    return new AppError("UNPROCESSABLE_ENTITY", message, 422, details);
  }

  static internal(message = "Internal server error"): AppError {
    return new AppError("INTERNAL_ERROR", message, 500);
  }

  static tooManyRequests(message = "Too many requests"): AppError {
    return new AppError("TOO_MANY_REQUESTS", message, 429);
  }
}

export function successResponse<T>(
  data: T,
  requestId: string,
  status = 200
): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    { success: true, data, requestId },
    { status }
  );
}

export function errorResponse(
  error: AppError | Error,
  requestId: string
): NextResponse<ApiErrorResponse> {
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.details ? { details: error.details } : {}),
        },
        requestId,
      },
      { status: error.statusCode }
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validation failed",
          details: error.issues.map((i) => ({
            field: i.path.join("."),
            message: i.message,
          })),
        },
        requestId,
      },
      { status: 422 }
    );
  }

  return NextResponse.json(
    {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: "An unexpected error occurred",
      },
      requestId,
    },
    { status: 500 }
  );
}

export function isPostgresUniqueViolation(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code: string }).code === "23505"
  );
}
