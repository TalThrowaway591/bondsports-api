
export interface Database<T> {
    tableName: string;
    create: (cat: T) => Promise<T>;
    get: () => Promise<T[]>;
    find: (id: string) => Promise<T | null>;
    // update: (id: string, row: T) => Promise<void>;
    // delete: (id: string) => Promise<void>;
}

export interface IInMemoryDb<T> extends Database<T> {
    memory: Map<string, T>;
}

export interface IPostgresql<T> extends Database<T> {
    connection: { promise: () => { execute: (query: string) => any } };
}

export type Entity = {
    id: string;
};

// correlates to x entities as they're saved in any data persistance layer
export type AccountEntityType = Entity & {
    personId: string;
    balance: number;
    dailyWithdrawlLimit: number;
    activeFlag: boolean;
    accountType: number;
    createdTimestamp: string;
};

