import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountEntity } from "../../app/entities/account-entity";

const blockAccountHandler = async (req: FastifyRequest<{ Params: { accountId: string } }>, res: FastifyReply) => {
    const accountEntityGateway = req.appProfile.getAccountEntityGateway();

    const { accountId } = req.params;

    const accountEntity = await accountEntityGateway.find(accountId)

    if (!accountEntity) {
        res.status(404).send('account not found')

        return;
    }

    accountEntity.blockAccount();

    await accountEntityGateway.update(accountId, accountEntity)

    res.send('test')

}

export { blockAccountHandler }
