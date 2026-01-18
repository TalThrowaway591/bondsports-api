import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountEntity } from "../../app/entities/account-entity";

interface RequestBody {
    personId: string;
    dailyWithdrawlLimit: string;
    accountType: number // TODO

}


interface CreateAccountRoute {
    Body: RequestBody
}

// TODO: add reply type
const createAccountHandler = async (req: FastifyRequest<CreateAccountRoute>, res: FastifyReply) => {
    const { personId, dailyWithdrawlLimit, accountType } = req.body;

    console.log('test')
    console.log(personId);



    // const entryEntityGateway = req.appProfile.getEntryEntityGateway();

    // const entryEntity = new EntryEntity();

    // const createdTimestamp = Date.now();

    // entryEntity.setTitle(title);
    // entryEntity.setBody(body);
    // entryEntity.setIP(userIPAddress);
    // entryEntity.setActive(true);
    // entryEntity.setCreatedTimestamp(createdTimestamp)

    // await entryEntityGateway.save(entryEntity);

    res.send('test')

}

export { createAccountHandler }
