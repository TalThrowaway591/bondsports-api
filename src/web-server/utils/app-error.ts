export class AppError extends Error {
    public readonly statusCode: number;
    public readonly code: string;
    public readonly details?: unknown;
    public readonly expose: boolean;

    constructor(opts: {
        message: string;
        statusCode: number;
        code: string;
        details?: unknown;
        expose?: boolean;
        cause?: unknown;
    }) {
        super(opts.message);
        this.name = "AppError";
        this.statusCode = opts.statusCode;
        this.code = opts.code;
        this.details = opts.details;
        this.expose = opts.expose ?? true;

        // @ts-expect-error
        if (opts.cause) this.cause = opts.cause;
    }
}

export class NotFoundError extends AppError {
    constructor(message = "Resource not found", details?: unknown) {
        super({ message, statusCode: 404, code: "NOT_FOUND", details });
    }
}

export class GeneralError extends AppError {
    constructor(message = "General Error", details?: unknown) {
        super({ message, statusCode: 500, code: "GENERAL", details });
    }
}

export class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super({ message, statusCode: 401, code: "UNAUTHORIZED" });
    }
}

export class ConflictError extends AppError {
    constructor(message = "Conflict", details?: unknown) {
        super({ message, statusCode: 409, code: "CONFLICT", details });
    }
}