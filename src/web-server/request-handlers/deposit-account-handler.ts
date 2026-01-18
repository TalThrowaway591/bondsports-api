import { FastifyRequest, FastifyReply } from 'fastify';
import { TransactionEntity } from '../../app/entities/transaction-entity';

const depositAccountHandler = async (req: FastifyRequest<{ Params: { accountId: string }, Body: { amount: number } }>, res: FastifyReply) => {
    const accountEntityGateway = req.appProfile.getAccountEntityGateway();
    const transactionEntityGateway = req.appProfile.getTransactionEntityGateway();

    const { accountId } = req.params;

    const { amount } = req.body;

    // TODO: must be a better way to make this atomic

    const accountEntity = await accountEntityGateway.find(accountId)

    if (!accountEntity) {
        res.status(404).send('account not found');

        return;
    }

    accountEntity.deposit(amount)

    await accountEntityGateway.update(accountId, accountEntity)

    try {
        const transactionEntity = new TransactionEntity();

        transactionEntity.setAccountId(accountId);
        transactionEntity.setAmount(amount);
        transactionEntity.setCreatedAt(Date.now());

        transactionEntityGateway.save(transactionEntity);

    } catch (e) {
        accountEntity.withdraw(amount)

        await accountEntityGateway.update(accountId, accountEntity)
    }

    res.send('test')

}

export { depositAccountHandler }
