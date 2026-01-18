import { AccountEntity } from "../entities/account-entity";

interface AccountEntityGateway {
    save(accountEntity: AccountEntity): Promise<void>;

    list(): Promise<AccountEntity[]>;

    find(accountId: string): Promise<AccountEntity>;

    // block(): Promise<void>;

    // delete(id: string): Promise<void>;
}

export { AccountEntityGateway };
