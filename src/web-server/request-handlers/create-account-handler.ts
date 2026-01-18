import { FastifyRequest, FastifyReply } from 'fastify';
import { AccountEntity } from "../../app/entities/account-entity";

interface RequestBody {
    personId: string;
    balance?: number;
    dailyWithdrawlLimit?: number;
    activeFlag?: boolean;
    accountType?: number // TODO

}


interface CreateAccountRoute {
    Body: RequestBody
}

// TODO: add reply type
const createAccountHandler = async (req: FastifyRequest<CreateAccountRoute>, res: FastifyReply) => {
    const {
        personId,
        balance = 0,
        dailyWithdrawlLimit = 1000, // rm business logic from handler
        activeFlag = true,
        accountType = 0,
    } = req.body;

    const accountEntityGateway = req.appProfile.getAccountEntityGateway();

    const accountEntity = new AccountEntity();

    accountEntity.setPersonId(personId);
    accountEntity.setBalance(balance)
    accountEntity.setDailyWithdrawlLimit(dailyWithdrawlLimit)
    accountEntity.setAccountType(accountType)
    accountEntity.setActiveFlag(activeFlag)
    accountEntity.setCreatedTimestamp(Date.now())

    await accountEntityGateway.save(accountEntity);

    res.send('test')

}

export { createAccountHandler }
