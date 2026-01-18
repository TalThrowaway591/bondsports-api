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
    async get(whereClause?: { key: string, value: string }): Promise<T[]> {
        let query = `SELECT * FROM ${this.tableName}`

        if (whereClause) {
            const { key, value } = whereClause
            const formattedValue = typeof value === 'string' ? `'${value}'` : value

            console.log(typeof value)
            query += ` WHERE ${key} = ${formattedValue}`
        }

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

    // TODO: fix parameres not general
    async getByBoundary(accountId: string, boundary: { startDate: number, endDate: number }): Promise<T[]> {
        const formattedBoundary = {
            startDate: new Date(boundary.startDate),
            endDate: new Date(boundary.endDate)
        }

        // TODO: change all queries to have this type of injection
        let query = `SELECT * FROM ${this.tableName} WHERE account_id = '${accountId}' AND created_at >= $1  AND created_at < $2`

        console.log('getByBoundary query')
        console.log(query)

        const result = (await this.client.query(query, [formattedBoundary.startDate, formattedBoundary.endDate])).rows;

        return result;
    }

    // async delete(accountId: string) {
    //     const query = `UPDATE ${this.tableName} SET active = false WHERE id='${accountId}'`

    //     await this.client.query(query);

    //     return null
    // }


}
