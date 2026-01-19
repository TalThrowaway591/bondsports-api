import { FastifyRequest, FastifyReply } from 'fastify';
import { TransactionEntity } from '../../app/entities/transaction-entity';
import { RouteGenericInterface } from 'fastify';
import { NotFoundError } from '../utils/server-error';

interface WithdrawAccountRoute extends RouteGenericInterface {
    Params: {
        accountId: string
    }
    Body: {
        amount: number;
    }
    Reply: {
        204: void // successful response - no content
    }
}

const withdrawAccountHandler = async (req: FastifyRequest<WithdrawAccountRoute>, res: FastifyReply<WithdrawAccountRoute>) => {
    const accountEntityGateway = req.appProfile.getAccountEntityGateway();
    const transactionEntityGateway = req.appProfile.getTransactionEntityGateway();

    const { accountId } = req.params;

    const { amount } = req.body;

    // TODO: must be a better way to make this atomic

    const accountEntity = await accountEntityGateway.find(accountId)

    if (!accountEntity) throw new NotFoundError("Account not found", { accountId })

    accountEntity.withdraw(amount)

    await accountEntityGateway.update(accountId, accountEntity)

    try {
        const transactionEntity = new TransactionEntity();

        transactionEntity.setAccountId(accountId);
        transactionEntity.setAmount(-amount);
        transactionEntity.setCreatedAt(Date.now());

        transactionEntityGateway.save(transactionEntity);

    } catch (e) {
        accountEntity.withdraw(amount)

        await accountEntityGateway.update(accountId, accountEntity)
    }

    res.code(204).send();

}

export { withdrawAccountHandler }
