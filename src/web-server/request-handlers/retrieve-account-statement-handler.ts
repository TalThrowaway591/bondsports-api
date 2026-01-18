import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountEntity } from "../../app/entities/account-entity";

const retrieveAccountStatemenetHandler = async (req: FastifyRequest<{ Params: { accountId: string }, Querystring: { from: string, to: string } }>, res: FastifyReply) => {
    const transactionEntityGateway = req.appProfile.getTransactionEntityGateway();

    const { from, to } = req.query;

    const timeBoundary = {
        startDate: new Date(from).getTime() || 0,
        endDate: new Date(to).getTime() || Date.now()
    }

    const { accountId } = req.params;

    const transactions = await transactionEntityGateway.listByDateBoundary(accountId, timeBoundary);

    res.send(transactions)

}

export { retrieveAccountStatemenetHandler }
