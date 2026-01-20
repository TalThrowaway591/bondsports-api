import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

import { withdrawAccountHandler } from "../../../src/web-server/request-handlers/withdraw-account-handler";
import { NotFoundError, ConflictError } from "../../../src/web-server/utils/server-error";
import { TransactionEntity } from "../../../src/app/entities/transaction-entity";

describe("withdrawAccountHandler", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        // Set a stable "today" so isToday() is predictable
        vi.setSystemTime(new Date("2026-01-20T12:00:00.000Z"));
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    const buildRes = () => {
        return {
            code: vi.fn().mockReturnThis(),
            send: vi.fn(),
        } as any;
    };

    it("should throw NotFoundError when account does not exist", async () => {
        const accountId = "acc_missing";

        const accountEntityGateway = {
            find: vi.fn().mockResolvedValue(null),
            update: vi.fn(),
        };

        const transactionEntityGateway = {
            list: vi.fn(),
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

        const res = buildRes();

        await expect(withdrawAccountHandler(req, res)).rejects.toBeInstanceOf(NotFoundError);

        expect(accountEntityGateway.find).toHaveBeenCalledWith(accountId);
        expect(transactionEntityGateway.list).not.toHaveBeenCalled();
        expect(accountEntityGateway.update).not.toHaveBeenCalled();
        expect(transactionEntityGateway.save).not.toHaveBeenCalled();

        expect(res.code).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("should throw ConflictError when withdrawal exceeds remaining daily limit", async () => {
        const accountId = "acc_1";
        const amount = 300;

        const accountEntity = {
            getDailyWithdrawlLimit: vi.fn().mockReturnValue(1000),
            withdraw: vi.fn(),
            deposit: vi.fn(),
        };

        // One "today" transaction with abs(amount) = 800 => remaining 200
        const txToday = new TransactionEntity();
        txToday.setAccountId(accountId);
        txToday.setAmount(-800);
        txToday.setCreatedAt(Date.now());

        const accountEntityGateway = {
            find: vi.fn().mockResolvedValue(accountEntity),
            update: vi.fn(),
        };

        const transactionEntityGateway = {
            list: vi.fn().mockResolvedValue([txToday]),
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

        const res = buildRes();

        await expect(withdrawAccountHandler(req, res)).rejects.toBeInstanceOf(ConflictError);

        expect(accountEntityGateway.find).toHaveBeenCalledWith(accountId);
        expect(transactionEntityGateway.list).toHaveBeenCalledWith(accountId);

        // should not withdraw/update/save when rejected by limit
        expect(accountEntity.withdraw).not.toHaveBeenCalled();
        expect(accountEntityGateway.update).not.toHaveBeenCalled();
        expect(transactionEntityGateway.save).not.toHaveBeenCalled();

        expect(res.code).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
    });

    it("should withdraw, update account, save transaction, and return 204 on success", async () => {
        const accountId = "acc_ok";
        const amount = 200;
        const now = Date.now();

        const accountEntity = {
            getDailyWithdrawlLimit: vi.fn().mockReturnValue(1000),
            withdraw: vi.fn(),
            deposit: vi.fn(),
        };

        // transactions include:
        // - today: abs(100) contributes 100
        // - yesterday: ignored by isToday()
        const txToday = new TransactionEntity();
        txToday.setAccountId(accountId);
        txToday.setAmount(-100);
        txToday.setCreatedAt(now);

        const txYesterday = new TransactionEntity();
        txYesterday.setAccountId(accountId);
        txYesterday.setAmount(-500);
        txYesterday.setCreatedAt(now - 24 * 60 * 60 * 1000);

        const accountEntityGateway = {
            find: vi.fn().mockResolvedValue(accountEntity),
            update: vi.fn().mockResolvedValue(undefined),
        };

        const transactionEntityGateway = {
            list: vi.fn().mockResolvedValue([txToday, txYesterday]),
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

        const res = buildRes();

        await withdrawAccountHandler(req, res);

        expect(accountEntityGateway.find).toHaveBeenCalledWith(accountId);
        expect(transactionEntityGateway.list).toHaveBeenCalledWith(accountId);

        // Withdraw + persist
        expect(accountEntity.withdraw).toHaveBeenCalledWith(amount);
        expect(accountEntityGateway.update).toHaveBeenCalledTimes(1);
        expect(accountEntityGateway.update).toHaveBeenCalledWith(accountId, accountEntity);

        // Transaction saved
        expect(transactionEntityGateway.save).toHaveBeenCalledTimes(1);

        const savedTx = transactionEntityGateway.save.mock.calls[0][0] as TransactionEntity;
        expect(savedTx).toBeInstanceOf(TransactionEntity);
        expect(savedTx.getAccountId()).toBe(accountId);
        expect(savedTx.getAmount()).toBe(-amount);
        expect(savedTx.getCreatedAt()).toBe(now);

        // Response
        expect(res.code).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith();
    });

    it("should rollback (deposit + second update) if saving transaction fails, and still return 204 (current behavior)", async () => {
        const accountId = "acc_rollback";
        const amount = 150;

        const accountEntity = {
            getDailyWithdrawlLimit: vi.fn().mockReturnValue(1000),
            withdraw: vi.fn(),
            deposit: vi.fn(),
        };

        const accountEntityGateway = {
            find: vi.fn().mockResolvedValue(accountEntity),
            update: vi.fn().mockResolvedValue(undefined),
        };

        const transactionEntityGateway = {
            list: vi.fn().mockResolvedValue([]),
            save: vi.fn().mockRejectedValue(new Error("DB error")),
        };

        const req: any = {
            params: { accountId },
            body: { amount },
            appProfile: {
                getAccountEntityGateway: () => accountEntityGateway,
                getTransactionEntityGateway: () => transactionEntityGateway,
            },
        };

        const res = buildRes();

        await withdrawAccountHandler(req, res);

        // Withdraw attempt
        expect(accountEntity.withdraw).toHaveBeenCalledWith(amount);

        // First persist after withdraw
        expect(accountEntityGateway.update).toHaveBeenCalledTimes(2);
        expect(accountEntityGateway.update).toHaveBeenNthCalledWith(1, accountId, accountEntity);

        // Rollback
        expect(accountEntity.deposit).toHaveBeenCalledWith(amount);
        expect(accountEntityGateway.update).toHaveBeenNthCalledWith(2, accountId, accountEntity);

        // Still returns 204 (because catch block does not rethrow)
        expect(res.code).toHaveBeenCalledWith(204);
        expect(res.send).toHaveBeenCalledWith();
    });
});
