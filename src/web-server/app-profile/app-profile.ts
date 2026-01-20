import { AccountEntityGateway } from "../../app/ports/account-entity-gateway";
import { PostgresqlDB } from "../../data-persistence/postgresql";
import { Client, Pool } from 'pg';
import { AccountEntityType, TransactionEntityType } from "../../types";
import { AccountPostgresEntityGateway } from "../../adapters/postgres-gateways/account-postgres-entity-gateway";
import { TransactionPostgresEntityGateway } from "../../adapters/postgres-gateways/transaction-postgres-entity-gateway";

// TODO: in memory DB
type Config = {
    pgPool: Pool;
};

abstract class AppProfile {
    private readonly pgPool: Pool;

    public constructor(config: Config) {
        this.pgPool = config.pgPool;
    }

    public getAccountEntityGateway(): AccountEntityGateway {
        const postgresqlDb = new PostgresqlDB<AccountEntityType>(this.pgPool, "accounts")

        return new AccountPostgresEntityGateway(postgresqlDb);
    }
    public getTransactionEntityGateway(): TransactionPostgresEntityGateway {
        const postgresqlDb = new PostgresqlDB<TransactionEntityType>(this.pgPool, "transactions")

        return new TransactionPostgresEntityGateway(postgresqlDb);
    }
}

export { AppProfile };
