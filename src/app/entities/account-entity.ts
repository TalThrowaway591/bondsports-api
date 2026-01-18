import { time } from "node:console";
import { Entity } from "./entity";

class AccountEntity extends Entity {
    private personId: string = "";

    private balance: number = 0;

    private dailyWithdrawlLimit: number = 0;

    private activeFlag: boolean = true;

    private accountType: number = 0;

    private createdTimestamp: number = Date.now();

    public constructor(id?: string) {
        super("account", id);
    }

    public setPersonId(personId: string): void {
        this.personId = personId;
    }

    public setBalance(balance: number): void {
        this.balance = balance;
    }

    public setDailyWithdrawlLimit(limit: number): void {
        this.dailyWithdrawlLimit = limit;
    }

    public setActiveFlag(isActive: boolean): void {
        this.activeFlag = isActive;
    }

    public setAccountType(accountType: number): void {
        this.accountType = accountType;
    }

    public setCreatedTimestamp(timestamp: number): void {
        this.createdTimestamp = timestamp;
    }

    public getPersonId(): string {
        return this.personId;
    }
    public getBalance(): number {
        return this.balance;
    }
    public getDailyWithdrawlLimit(): number {
        return this.dailyWithdrawlLimit;
    }
    public isActive(): boolean {
        return this.activeFlag;
    }
    public getAccountType(): number {
        return this.accountType;
    }
    public getCreatedTimestamp(): number {
        return this.createdTimestamp;
    }
}

export { AccountEntity };
