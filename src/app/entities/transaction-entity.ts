import { Entity } from "./entity";

class TransactionEntity extends Entity {
    private accountId: string = "";

    private amount: number = 0;

    private createdAt: number = Date.now();

    public constructor(id?: string) {
        super("transaction", id);
    }

    public setAccountId(accountId: string): void {
        this.accountId = accountId;
    }

    public setAmount(amount: number): void {
        this.amount = amount;
    }

    public setCreatedAt(date: number): void {
        this.createdAt = date;
    }

    public getAccountId(): string {
        return this.accountId;
    }

    public getAmount(): number {
        return this.amount;
    }

    public getCreatedAt(): number {
        return this.createdAt;
    }
}

export { TransactionEntity };
