import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { LocalAppProfile } from "./app-profile/local-app-profile";
import { Config } from "./config";
import { routes } from "./routes";

const registerRequestHandlers = (app: FastifyInstance) => {

    app.get(routes.heartbeat, (req: FastifyRequest, res: FastifyReply) => { res.send(1) });
};

const createServer = async (): Promise<FastifyInstance> => {
    const app = Fastify({
        logger: true
    });

    const config = { postgresqlClient: await Config.getPostgresClient() }

    const appProfile = new LocalAppProfile(config);

    registerRequestHandlers(app);

    return app;
};

export { createServer };
