import { AccountEntityGateway } from "../../app/ports/account-entity-gateway";
import { PostgresqlDB } from "../../data-persistence/postgresql";
import { Client } from 'pg';
import { AccountEntityType, TransactionEntityType } from "../../types";
import { AccountPostgresEntityGateway } from "../../adapters/postgres-gateways/account-postgres-entity-gateway";
import { TransactionPostgresEntityGateway } from "../../adapters/postgres-gateways/transaction-postgres-entity-gateway";

// TODO: in memory DB
type Config = {
    postgresqlClient: Client;
};

abstract class AppProfile {
    private readonly postgresqlClient: Client;

    public constructor(config: Config) {
        this.postgresqlClient = config.postgresqlClient;
    }

    public getAccountEntityGateway(): AccountEntityGateway {
        const postgresqlDb = new PostgresqlDB<AccountEntityType>(this.postgresqlClient, "accounts")

        return new AccountPostgresEntityGateway(postgresqlDb);
    }
    public getTransactionEntityGateway(): TransactionPostgresEntityGateway {
        const postgresqlDb = new PostgresqlDB<TransactionEntityType>(this.postgresqlClient, "transactions")

        return new TransactionPostgresEntityGateway(postgresqlDb);
    }
}

export { AppProfile };
