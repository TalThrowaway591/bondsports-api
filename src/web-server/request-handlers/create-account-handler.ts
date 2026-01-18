import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountEntity } from "../../app/entities/account-entity";

interface RouteOptions {
    Reply: any[] | string
}

const createEntryHandler = async (req: FastifyRequest, res: FastifyReply<RouteOptions>) => {
    const { title, body } = req.body;

    // const entryEntityGateway = req.appProfile.getEntryEntityGateway();

    // const entryEntity = new EntryEntity();

    // const createdTimestamp = Date.now();

    // entryEntity.setTitle(title);
    // entryEntity.setBody(body);
    // entryEntity.setIP(userIPAddress);
    // entryEntity.setActive(true);
    // entryEntity.setCreatedTimestamp(createdTimestamp)

    // await entryEntityGateway.save(entryEntity);

    res.send('tes')
}

export { createEntryHandler }
