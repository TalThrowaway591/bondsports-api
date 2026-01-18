import { Database } from "../types";
import { Client } from 'pg';

function updateQuerySetter<G extends object>(row: G): string {
    return Object.entries(row)
        .map(([key, value]) => {
            const formatted =
                typeof value === "string" ? `'${value}'` : value;
            return `${key}=${formatted}`;
        })
        .join(", ");
}

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

    async update(id: string, row: T) {
        const updateQueryString = updateQuerySetter<T>(row);

        const query = `UPDATE ${this.tableName} SET ${updateQueryString} WHERE id='${id}'`

        console.log('updateQueryString')
        console.log(query)

        await this.client.query(query);

        return;
    }

    async find(accountId: string): Promise<T | null> {
        const query = `SELECT * FROM ${this.tableName} WHERE id='${accountId}'`

        const result = (await this.client.query(query)).rows[0];

        console.log('result')
        console.log(result)

        return result;
    }

    // async delete(accountId: string) {
    //     const query = `UPDATE ${this.tableName} SET active = false WHERE id='${accountId}'`

    //     await this.client.query(query);

    //     return null
    // }


}
