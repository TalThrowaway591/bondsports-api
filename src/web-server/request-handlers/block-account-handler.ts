import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountEntity } from "../../app/entities/account-entity";
import { GeneralError, NotFoundError } from '../utils/app-error';

const blockAccountHandler = async (req: FastifyRequest<{ Params: { accountId: string } }>, res: FastifyReply) => {
    const accountEntityGateway = req.appProfile.getAccountEntityGateway();

    const { accountId } = req.params;

    const accountEntity = await accountEntityGateway.find(accountId)

    if (!accountEntity) throw new NotFoundError("Account not found", { accountId })

    accountEntity.blockAccount();

    try {
        await accountEntityGateway.update(accountId, accountEntity)
    } catch (e) {
        throw new GeneralError("Error blocking account", { accountId })
    }

    res.send()

}

export { blockAccountHandler }
