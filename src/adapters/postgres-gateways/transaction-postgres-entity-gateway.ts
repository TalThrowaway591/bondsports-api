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
        this.tableName = "transactions"
    }


    async save(transactionEntity: TransactionEntity): Promise<void> {
        await this.db.create(mapEntryToRow(transactionEntity));

        return;
    }

    async listByAccountId(accountId: string): Promise<TransactionEntity[]> {
        const result = await this.db.get({ key: 'account_id', value: accountId });

        return result.map(value => mapRowToEntry(value));
    }

    async listByDateBoundary(accountId: string, boundary: { startDate: number, endDate: number }): Promise<TransactionEntity[]> {
        const result = await this.db.getByBoundary(accountId, boundary);

        return result.map(value => mapRowToEntry(value));
    }

    async getWithdrawalAmountByDateBoundary(
        accountId: string,
        boundary: { startDate: number; endDate: number }
    ): Promise<number> {
        const startDate = new Date(boundary.startDate);
        const endDate = new Date(boundary.endDate);

        // withdrawals are negative in your model, so filter amount < 0 and sum abs(amount)
        const sql = `
      SELECT COALESCE(SUM(ABS(amount)), 0) AS total
      FROM ${this.db.tableName}
      WHERE account_id = $1
        AND created_at >= $2
        AND created_at < $3
        AND amount < 0
    `;

        const rows = await this.db.query<{ total: string | number }>(sql, [
            accountId,
            startDate,
            endDate,
        ]);

        return Number(rows[0]?.total ?? 0);
    }
}

}

export { TransactionPostgresEntityGateway };
