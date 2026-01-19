import { Entity } from "./entity";
import { InvalidTransactionAmountError } from "../errors/transaction-errors";

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

        if (!Number.isFinite(amount)) throw new InvalidTransactionAmountError(amount)

        if (!Number.isInteger(amount)) throw new InvalidTransactionAmountError(amount)

        if (amount === 0) throw new InvalidTransactionAmountError(amount)


        // maybe add conditional for max amount?

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
