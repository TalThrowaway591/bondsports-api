import { AccountEntityType } from '../../types'
import { AccountEntityGateway } from "../../app/ports/account-entity-gateway";
import { PostgresqlDB } from "../../data-persistance/postgresql";
import { AccountEntity } from "../../app/entities/account-entity";

const mapRowToEntry = (value: AccountEntityType): AccountEntity => {
    const {
        id,
        personId,
        balance,
        dailyWithdrawlLimit,
        activeFlag,
        accountType,
        createdTimestamp
    } = value;

    const accountEntity = new AccountEntity(id);

    accountEntity.setPersonId(personId);
    accountEntity.setBalance(balance);
    accountEntity.setDailyWithdrawlLimit(dailyWithdrawlLimit);
    accountEntity.setActiveFlag(activeFlag);
    accountEntity.setAccountType(accountType);
    accountEntity.setCreatedTimestamp(Date.parse(createdTimestamp))

    return accountEntity;
};

const mapEntryToRow = (accountEntity: AccountEntity): AccountEntityType => {
    const id = accountEntity.getId();
    const personId = accountEntity.getPersonId();
    const balance = accountEntity.getBalance();
    const dailyWithdrawlLimit = accountEntity.getDailyWithdrawlLimit();
    const activeFlag = accountEntity.isActive();
    const accountType = accountEntity.getAccountType();
    const createdTimestamp = new Date(accountEntity.getCreatedTimestamp()).toISOString();

    return {
        id,
        personId,
        balance,
        dailyWithdrawlLimit,
        activeFlag,
        accountType,
        createdTimestamp
    }
};

class EntryPostgresEntityGateway implements AccountEntityGateway {
    protected readonly db: PostgresqlDB<AccountEntityType>

    protected readonly tableName: string;

    public constructor(db: PostgresqlDB<AccountEntityType>) {
        this.db = db;
        this.tableName = "accounts"
    }

    async list(): Promise<AccountEntity[]> {
        const result = await this.db.get();

        const entries = result.map(value => mapRowToEntry(value));

        return entries.filter(entry => !!entry.isActive);
    }

    async save(accountEntity: AccountEntity): Promise<void> {
        await this.db.create(mapEntryToRow(accountEntity));

        return;
    }

    async delete(entryId: string): Promise<void> {
        await this.db.delete(entryId);

        return;
    }
}

export { EntryPostgresEntityGateway };
