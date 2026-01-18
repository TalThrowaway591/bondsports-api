import { TransactionEntityType } from '../../types'
import { TransactionEntityGateway } from "../../app/ports/transaction-entity-gateway";
import { PostgresqlDB } from "../../data-persistence/postgresql";
import { TransactionEntity } from "../../app/entities/transaction-entity";

const mapRowToEntry = (value: TransactionEntityType): TransactionEntity => {
    const {
        id,
        account_id,
        amount,
        created_at
    } = value;

    const transationEntity = new TransactionEntity(id);

    transationEntity.setAccountId(account_id);
    transationEntity.setAmount(amount);
    transationEntity.setCreatedAt(Date.parse(created_at))

    return transationEntity;
};

const mapEntryToRow = (transationEntity: TransactionEntity): TransactionEntityType => {
    const id = transationEntity.getId();
    const account_id = transationEntity.getAccountId();
    const amount = transationEntity.getAmount();
    const created_at = new Date(transationEntity.getCreatedAt()).toISOString();

    return {
        id,
        account_id,
        amount,
        created_at
    }
};

class TransactionPostgresEntityGateway implements TransactionEntityGateway {
    protected readonly db: PostgresqlDB<TransactionEntityType>

    protected readonly tableName: string;

    public constructor(db: PostgresqlDB<TransactionEntityType>) {
        this.db = db;
        this.tableName = "accounts"
    }


    async save(transactionEntity: TransactionEntity): Promise<void> {
        await this.db.create(mapEntryToRow(transactionEntity));

        return;
    }

    // async delete(entryId: string): Promise<void> {
    //     await this.db.delete(entryId);

    //     return;
    // }
}

export { TransactionPostgresEntityGateway };
