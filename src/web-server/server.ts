import Fastify, { FastifyInstance } from "fastify";
import { LocalAppProfile } from "./app-profile/local-app-profile";
import { Config } from "./config";


const createServer = async (): Promise<FastifyInstance> => {
    const app = Fastify({
        logger: true
    });

    const config = {}

    const appProfile = new LocalAppProfile(config);


    return app;
};

export { createServer };
