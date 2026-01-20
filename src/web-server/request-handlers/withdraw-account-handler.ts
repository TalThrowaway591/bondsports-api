import { FastifyRequest, FastifyReply } from 'fastify';
import { TransactionEntity } from '../../app/entities/transaction-entity';
import { RouteGenericInterface } from 'fastify';
import { NotFoundError, ConflictError } from '../utils/server-error';

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

    // TODO: fetching all transactions for a given account is not scalable and REALLY expensive
    // should add a new method for transactionEntityGateway and the corresponding DB interface:
    // something like  getDailyWithdrawlAmount(acountId)

    const accountTransactions = await transactionEntityGateway.list(accountId);

    let dailyWithdrawAmount = getDailyWithdrawAmount(accountTransactions);

    if (amount > accountEntity.getDailyWithdrawlLimit() - dailyWithdrawAmount) {
        throw new ConflictError('Withdraw amount exceeds daily limit', {
            accountId,
            dailyWithdrawAmount,
            dailyLimit: accountEntity.getDailyWithdrawlLimit()
        })
    }

    // NOTE: busines logic validation exists inside entity to ensure valid withdrawl

    accountEntity.withdraw(amount)

    await accountEntityGateway.update(accountId, accountEntity)

    try {
        const transactionEntity = new TransactionEntity();

        transactionEntity.setAccountId(accountId);
        transactionEntity.setAmount(-amount);
        transactionEntity.setCreatedAt(Date.now());

        await transactionEntityGateway.save(transactionEntity);

    } catch (e) {
        accountEntity.deposit(amount)

        await accountEntityGateway.update(accountId, accountEntity)
    }

    res.code(204).send();

}


const getDailyWithdrawAmount = (transactions: TransactionEntity[]): number => {
    let amount = 0;

    transactions.filter(transaction => isToday(transaction.getCreatedAt())).forEach(transaction => amount += Math.abs(transaction.getAmount()))
    return amount;
}

const isToday = (timestamp: number): boolean => {
    const d = new Date(timestamp);

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

    return d >= startOfToday && d < startOfTomorrow;
}

export { withdrawAccountHandler }
