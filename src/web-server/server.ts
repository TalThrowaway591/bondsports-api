import Fastify, { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { LocalAppProfile } from "./app-profile/local-app-profile";
import { Config } from "./config";
import { routes } from "./utils/routes";
import * as requestHandlers from "./request-handlers/index";
import { AppProfile } from "./app-profile/app-profile";
import sensible from "@fastify/sensible";
import { errorHandlerPlugin } from "./plugins/error-handler";
import { createAccountSchema } from "./schemas/create-account-schema";


const registerRequestHandlers = (app: FastifyInstance) => {
    app.get(routes.heartbeat, (req: FastifyRequest, res: FastifyReply) => { res.send(1) });
    app.post(routes.accounts.create, { schema: createAccountSchema }, requestHandlers.createAccountHandler)
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

    await app.register(sensible)

    await app.register(errorHandlerPlugin)

    return app;
};

export { createServer };
