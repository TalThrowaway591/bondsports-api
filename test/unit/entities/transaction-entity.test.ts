import { describe, it, expect, beforeEach, vi } from "vitest";
import { TransactionEntity } from "../../../src/app/entities/transaction-entity";

describe("TransactionEntity", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("should initialize with correct defaults", () => {
        const entity = new TransactionEntity();

        expect(entity.getAccountId()).toBe("");
        expect(entity.getAmount()).toBe(0);

        const createdAt = entity.getCreatedAt();
        expect(typeof createdAt).toBe("number");
        expect(createdAt).toBeGreaterThan(0);
    });

    it("should set and get accountId", () => {
        const entity = new TransactionEntity();

        entity.setAccountId("acc_123");
        expect(entity.getAccountId()).toBe("acc_123");
    });

    it("should set and get amount", () => {
        const entity = new TransactionEntity();

        entity.setAmount(250);
        expect(entity.getAmount()).toBe(250);
    });

    it("should set and get createdAt", () => {
        const entity = new TransactionEntity();

        entity.setCreatedAt(1700000000000);
        expect(entity.getCreatedAt()).toBe(1700000000000);
    });

    it("should allow setting all properties together", () => {
        const entity = new TransactionEntity();

        entity.setAccountId("acc_999");
        entity.setAmount(-75); // negative could represent withdrawal (depends on your domain)
        entity.setCreatedAt(946684800000); // 2000-01-01 UTC

        expect(entity.getAccountId()).toBe("acc_999");
        expect(entity.getAmount()).toBe(-75);
        expect(entity.getCreatedAt()).toBe(946684800000);
    });
});
