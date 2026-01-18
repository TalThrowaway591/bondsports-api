import { Database } from "../types";
import { Client } from 'pg';

export class PostgresqlDB<T extends object> implements Database<T> {
    client: Client;
    tableName: string;

    constructor(client: any, tableName: string) {
        this.client = client;
        this.tableName = tableName;
    }
    async get(): Promise<T[]> {
        const query = `SELECT * FROM ${this.tableName}`

        const result = (await this.client.query(query)).rows;

        return result;
    }

    async create(row: T) {
        const columns = Object.keys(row).reduce(
            (previous: string, current: string) => `${previous.length > 0 ? `${previous},` : previous} ${current}`,
            ""
        );
        const values = Object.values(row).reduce(
            (previous: string, current: string) =>
                `${previous.length > 0 ? `${previous},` : previous} ${typeof current === "string" ? `'${current}'` : current}`,
            ""
        );

        const query = `INSERT INTO ${this.tableName} (${columns}) VALUES (${values})`;

        await this.client.query(query);

        return row;
    }

    async find(entryId: string) {
        return null
    }

    async delete(entryId: string) {
        const query = `UPDATE ${this.tableName} SET active = false WHERE id='${entryId}'`

        await this.client.query(query);

        return null
    }


}
