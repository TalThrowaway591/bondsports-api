import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { LocalAppProfile } from "./app-profile/local-app-profile";
import { Config } from "./config";
import { routes } from "./routes";
import * as requestHandlers from "./request-handlers/index";
import { AppProfile } from "./app-profile/app-profile";


const registerRequestHandlers = (app: FastifyInstance) => {
    app.get(routes.heartbeat, (req: FastifyRequest, res: FastifyReply) => { res.send(1) });
    app.post(routes.accounts.create, requestHandlers.createAccountHandler)
    app.post(routes.accounts.block, requestHandlers.blockAccountHandler)
    app.post(routes.accounts.deposit, requestHandlers.depositAccountHandler)
    app.get(routes.accounts.statement, requestHandlers.retrieveAccountStatemenetHandler)
};


const registerAppProfile = (app: FastifyInstance, appProfile: AppProfile): void => {
    app.decorateRequest('appProfile', {
        getter() {
            return appProfile
        }
    })
};

const createServer = async (): Promise<FastifyInstance> => {
    const app = Fastify({
        logger: true
    });

    const config = { postgresqlClient: await Config.getPostgresClient() }

    const appProfile = new LocalAppProfile(config);

    registerAppProfile(app, appProfile)

    registerRequestHandlers(app);


    return app;
};

export { createServer };
