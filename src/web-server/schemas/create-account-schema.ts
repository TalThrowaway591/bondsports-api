export const createAccountSchema = {
    body: {
        type: "object",
        required: ["personId"],
        additionalProperties: false,
        properties: {
            personId: { type: "string", minLength: 1 },
            dailyWithdrawlLimit: { type: "number", minimum: 0 },
            activeFlag: { type: "boolean" },
            accountType: { type: "integer", minimum: 0 },
        },
    },
    response: {
        201: {
            type: "object",
            required: [
                "id",
                "personId",
                "balance",
                "dailyWithdrawlLimit",
                "activeFlag",
                "accountType",
                "createdTimestamp",
            ],
            additionalProperties: false,
            properties: {
                id: { type: "string" },
                personId: { type: "string" },
                balance: { type: "number" },
                dailyWithdrawlLimit: { type: "number" },
                activeFlag: { type: "boolean" },
                accountType: { type: "integer" },
                createdTimestamp: { type: "number" },
            },
        },
        400: {
            type: "object",
            required: ["message"],
            additionalProperties: false,
            properties: {
                message: { type: "string" },
            },
        },
    },
} as const;
