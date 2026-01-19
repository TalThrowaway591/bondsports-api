import type { FastifyInstance, FastifyError } from "fastify";
import { AppError } from "../utils/app-error";
import type { ErrorResponse } from "../../types";

function isFastifyValidationError(err: unknown): err is FastifyError & { validation: unknown } {
    return typeof err === "object" && err !== null && "validation" in err;
}


export async function errorHandlerPlugin(app: FastifyInstance) {
    // Handle 404s cleanly
    app.setNotFoundHandler(async (request, reply) => {
        const body: ErrorResponse = {
            error: {
                code: "NOT_FOUND",
                message: `Route ${request.method} ${request.url} not found`,
                requestId: request.id,
            },
        };
        return reply.status(404).send(body);
    });

    // Central error handler
    app.setErrorHandler(async (err, request, reply) => {
        // If Fastify already started sending headers, don't break the stream
        if (reply.sent) {
            request.log.error({ err }, "Error after reply was sent");
            return;
        }

        // 1) Schema/validation errors (body/query/params)
        // Fastify sets: err.code === 'FST_ERR_VALIDATION' and includes `validation`
        if ((err as FastifyError).code === "FST_ERR_VALIDATION" || isFastifyValidationError(err)) {
            const body: ErrorResponse = {
                error: {
                    code: "VALIDATION_ERROR",
                    message: "Request validation failed",
                    requestId: request.id,
                    details: (err as any).validation,
                },
            };

            // Log as warn (not server crash)
            request.log.warn({ err }, "Validation error");
            return reply.status(400).send(body);
        }

        // 2) Your domain/business errors
        if (err instanceof AppError) {
            // Log 4xx as warn, 5xx as error
            const level = err.statusCode >= 500 ? "error" : "warn";
            request.log[level]({ err }, "App error");

            const body: ErrorResponse = {
                error: {
                    code: err.code,
                    message: err.expose ? err.message : "Internal server error",
                    requestId: request.id,
                    details: err.expose ? err.details : undefined,
                },
            };

            return reply.status(err.statusCode).send(body);
        }

        // 3) Fastify-sensible httpErrors (or other errors with statusCode)
        const statusCode =
            typeof (err as any).statusCode === "number" ? (err as any).statusCode : 500;

        const isServerError = statusCode >= 500;

        request.log[isServerError ? "error" : "warn"]({ err }, "Unhandled error");

        const body: ErrorResponse = {
            error: {
                code: isServerError ? "INTERNAL_SERVER_ERROR" : "REQUEST_ERROR",
                message: isServerError ? "Internal server error" : (err as Error).message,
                requestId: request.id,
            },
        };

        return reply.status(statusCode).send(body);
    });
}
