import 'dotenv/config'
import { Client } from 'pg';
import config from "config";

const once = <T>(cb: () => T): (() => T) => {
    let t: undefined | T;

    return () => {
        if (!t) t = cb();

        return t;
    };
};

export { once };


const Config = {
    get(key: string): any {
        try {
            return config.get(key);
        } catch (e) {
            return undefined;
        }
    },

    getPostgresClient: once(async (): Promise<Client> => {
        const connectionConfig = config.get("postgresql") as object;

        const client = new Client(connectionConfig)

        await client.connect();

        // @ts-ignore
        console.log(`Connected to Postgres database on port ${connectionConfig.port}`)

        return client;
    }),
}

export { Config }