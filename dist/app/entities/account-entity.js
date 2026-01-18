"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountEntity = void 0;
const entity_1 = require("./entity");
class AccountEntity extends entity_1.Entity {
    constructor(id) {
        super("account", id);
        this.personId = "";
        this.balance = 0;
        this.dailyWithdrawlLimit = 0;
        this.activeFlag = true;
        this.accountType = 0;
        this.createdTimestamp = Date.now();
    }
    setPersonId(personId) {
        this.personId = personId;
    }
    setBalance(balance) {
        this.balance = balance;
    }
    setDailyWithdrawlLimit(limit) {
        this.dailyWithdrawlLimit = limit;
    }
    setActiveFlag(isActive) {
        this.activeFlag = isActive;
    }
    setAccountType(accountType) {
        this.accountType = accountType;
    }
    setCreatedTimestamp(timestamp) {
        this.createdTimestamp = timestamp;
    }
    getPersonId() {
        return this.personId;
    }
    getBalance() {
        return this.balance;
    }
    getDailyWithdrawlLimit() {
        return this.dailyWithdrawlLimit;
    }
    isActive() {
        return this.activeFlag;
    }
    getAccountType() {
        return this.accountType;
    }
    getCreatedTimestamp() {
        return this.createdTimestamp;
    }
}
exports.AccountEntity = AccountEntity;
