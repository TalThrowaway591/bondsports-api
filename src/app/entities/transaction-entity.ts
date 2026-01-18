import { Entity } from "./entity";

class TransactionEntity extends Entity {
    private accountId: string = "";

    private value: number = 0;

    private date: number = Date.now();

    public constructor(id?: string) {
        super("transaction", id);
    }

    public setAccountId(accountId: string): void {
        this.accountId = accountId;
    }

    public setValue(value: number): void {
        this.value = value;
    }

    public setDate(date: number): void {
        this.date = date;
    }

    public getAccountId(): string {
        return this.accountId;
    }

    public getValue(): number {
        return this.value;
    }

    public getDate(): number {
        return this.date;
    }
}

export { TransactionEntity };
