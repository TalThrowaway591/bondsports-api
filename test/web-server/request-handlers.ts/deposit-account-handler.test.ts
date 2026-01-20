import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { depositAccountHandler } from "../../../src/web-server/request-handlers/deposit-account-handler";
import { NotFoundError } from "../../../src/web-server/utils/server-error";
import { TransactionEntity } from "../../../src/app/entities/transaction-entity";

describe("depositAccountHandler", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it("should throw NotFoundError when account does not exist", async () => {
        const accountId = "acc-missing";

        const accountEntityGateway = {
            find: vi.fn().mockResolvedValue(null),
            update: vi.fn(),
        };

        const transactionEntityGateway = {
            save: vi.fn(),
        };

        const req: any = {
            params: { accountId },
            body: { amount: 100 },
            appProfile: {
                getAccountEntityGateway: () => accountEntityGateway,
                getTransactionEntityGateway: () => transactionEntityGateway,
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await expect(depositAccountHandler(req, res)).rejects.toBeInstanceOf(NotFoundError);

        expect(accountEntityGateway.find).toHaveBeenCalledWith(accountId);
        expect(accountEntityGateway.update).not.toHaveBeenCalled();
        expect(transactionEntityGateway.save).not.toHaveBeenCalled();
        expect(res.code).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("should deposit, persist account, save transaction, and return 204", async () => {
        const accountId = "acc-123";
        const amount = 250;
        const now = 1700000000000;

        vi.spyOn(Date, "now").mockReturnValue(now);

        const accountEntity = {
            deposit: vi.fn(),
            withdraw: vi.fn(),
        };

        const accountEntityGateway = {
            find: vi.fn().mockResolvedValue(accountEntity),
            update: vi.fn().mockResolvedValue(undefined),
        };

        const transactionEntityGateway = {
            save: vi.fn().mockResolvedValue(undefined),
        };

        const req: any = {
            params: { accountId },
            body: { amount },
            appProfile: {
                getAccountEntityGateway: () => accountEntityGateway,
                getTransactionEntityGateway: () => transactionEntityGateway,
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await depositAccountHandler(req, res);

        // Account was looked up
        expect(accountEntityGateway.find).toHaveBeenCalledWith(accountId);

        // Deposit called
        expect(accountEntity.deposit).toHaveBeenCalledWith(amount);

        // Account persisted once
        expect(accountEntityGateway.update).toHaveBeenCalledTimes(1);
        expect(accountEntityGateway.update).toHaveBeenCalledWith(accountId, accountEntity);

        // Transaction saved once
        expect(transactionEntityGateway.save).toHaveBeenCalledTimes(1);

        // Validate transaction content (using getters)
        const savedTx = transactionEntityGateway.save.mock.calls[0][0] as TransactionEntity;
        expect(savedTx).toBeInstanceOf(TransactionEntity);
        expect(savedTx.getAccountId()).toBe(accountId);
        expect(savedTx.getAmount()).toBe(amount);
        expect(savedTx.getCreatedAt()).toBe(now);

        // No rollback happened
        expect(accountEntity.withdraw).not.toHaveBeenCalled();

        // Response
        expect(res.code).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith();
    });

    it("should rollback account update if transaction save fails, and still return 204 (current behavior)", async () => {
        const accountId = "acc-rollback";
        const amount = 500;

        const accountEntity = {
            deposit: vi.fn(),
            withdraw: vi.fn(),
        };

        const accountEntityGateway = {
            find: vi.fn().mockResolvedValue(accountEntity),
            update: vi.fn().mockResolvedValue(undefined),
        };

        const transactionEntityGateway = {
            save: vi.fn().mockRejectedValue(new Error("DB failure")),
        };

        const req: any = {
            params: { accountId },
            body: { amount },
            appProfile: {
                getAccountEntityGateway: () => accountEntityGateway,
                getTransactionEntityGateway: () => transactionEntityGateway,
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await depositAccountHandler(req, res);

        // deposit called
        expect(accountEntity.deposit).toHaveBeenCalledWith(amount);

        // initial update + rollback update
        expect(accountEntityGateway.update).toHaveBeenCalledTimes(2);
        expect(accountEntityGateway.update).toHaveBeenNthCalledWith(1, accountId, accountEntity);
        expect(accountEntity.withdraw).toHaveBeenCalledWith(amount);
        expect(accountEntityGateway.update).toHaveBeenNthCalledWith(2, accountId, accountEntity);

        // still returns 204 in current handler implementation
        expect(res.code).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith();
    });

    it("should bubble up if accountEntity.deposit throws (no update/save/response)", async () => {
        const accountId = "acc-err";
        const amount = -10;

        const accountEntity = {
            deposit: vi.fn(() => {
                throw new Error("Invalid amount");
            }),
            withdraw: vi.fn(),
        };

        const accountEntityGateway = {
            find: vi.fn().mockResolvedValue(accountEntity),
            update: vi.fn(),
        };

        const transactionEntityGateway = {
            save: vi.fn(),
        };

        const req: any = {
            params: { accountId },
            body: { amount },
            appProfile: {
                getAccountEntityGateway: () => accountEntityGateway,
                getTransactionEntityGateway: () => transactionEntityGateway,
            },
        };

        const res: any = {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        };

        await expect(depositAccountHandler(req, res)).rejects.toThrow("Invalid amount");

        expect(accountEntityGateway.update).not.toHaveBeenCalled();
        expect(transactionEntityGateway.save).not.toHaveBeenCalled();
        expect(res.code).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });
});
