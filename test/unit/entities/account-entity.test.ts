import { describe, it, expect, beforeEach, vi } from "vitest";
import { AccountEntity } from "../../../src/app/entities/account-entity";

describe("AccountEntity", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it("should initialize with correct defaults", () => {
        const entity = new AccountEntity();

        expect(entity.getPersonId()).toBe("");
        expect(entity.getBalance()).toBe(0);
        expect(entity.getDailyWithdrawlLimit()).toBe(0);
        expect(entity.isActive()).toBe(true);
        expect(entity.getAccountType()).toBe(0);

        const ts = entity.getCreatedTimestamp();
        expect(typeof ts).toBe("number");
        expect(ts).toBeGreaterThan(0);
    });

    it("should set and get personId", () => {
        const entity = new AccountEntity();

        entity.setPersonId("person_123");
        expect(entity.getPersonId()).toBe("person_123");
    });

    it("should set and get balance", () => {
        const entity = new AccountEntity();

        entity.setBalance(500);
        expect(entity.getBalance()).toBe(500);
    });

    it("should set and get dailyWithdrawlLimit", () => {
        const entity = new AccountEntity();

        entity.setDailyWithdrawlLimit(2500);
        expect(entity.getDailyWithdrawlLimit()).toBe(2500);
    });

    it("should set and get activeFlag", () => {
        const entity = new AccountEntity();

        entity.setActiveFlag(false);
        expect(entity.isActive()).toBe(false);

        entity.setActiveFlag(true);
        expect(entity.isActive()).toBe(true);
    });

    it("should set and get accountType", () => {
        const entity = new AccountEntity();

        entity.setAccountType(2);
        expect(entity.getAccountType()).toBe(2);
    });

    it("should set and get createdTimestamp", () => {
        const entity = new AccountEntity();

        entity.setCreatedTimestamp(1700000000000);
        expect(entity.getCreatedTimestamp()).toBe(1700000000000);
    });

    it("blockAccount() should mark the account as inactive", () => {
        const entity = new AccountEntity();

        expect(entity.isActive()).toBe(true);

        entity.blockAccount();
        expect(entity.isActive()).toBe(false);
    });

    it("deposit() should increase balance", () => {
        const entity = new AccountEntity();

        entity.setBalance(100);
        entity.deposit(50);

        expect(entity.getBalance()).toBe(150);
    });

    it("withdraw() should decrease balance", () => {
        const entity = new AccountEntity();

        entity.setBalance(200);
        entity.withdraw(80);

        expect(entity.getBalance()).toBe(120);
    });

    it("should support a deposit + withdraw sequence", () => {
        const entity = new AccountEntity();

        entity.setBalance(0);

        entity.deposit(1000);
        entity.withdraw(250);
        entity.deposit(40);

        expect(entity.getBalance()).toBe(790);
    });
});
