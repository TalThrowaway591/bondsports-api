import { AccountEntity } from "../entities/account-entity";

interface AccountEntityGateway {
    save(accountEntity: AccountEntity): Promise<void>;

    list(): Promise<AccountEntity[]>;

    // delete(id: string): Promise<void>;
}

export { AccountEntityGateway };
