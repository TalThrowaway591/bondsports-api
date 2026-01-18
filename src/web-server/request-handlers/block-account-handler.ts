import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountEntity } from "../../app/entities/account-entity";

const blockAccountHandler = async (req: FastifyRequest<{ Params: { accountId: string } }>, res: FastifyReply) => {
    const accountEntityGateway = req.appProfile.getAccountEntityGateway();

    const { accountId } = req.params;


    const accountEntity = await accountEntityGateway.find(accountId)

    accountEntity.setActiveFlag(false)




    res.send('test')

}

export { blockAccountHandler }
