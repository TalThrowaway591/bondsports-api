import { TransactionEntity } from "../entities/transaction-entity";

interface TransactionEntityGateway {
    save(transactionEntity: TransactionEntity): Promise<void>;

    // list(): Promise<AccountEntity[]>;

    // find(accountId: string): Promise<AccountEntity>;

    // update(accountId: string, accountEntity: AccountEntity): Promise<void>;

    // block(): Promise<void>;

    // delete(id: string): Promise<void>;
}

export { TransactionEntityGateway };
