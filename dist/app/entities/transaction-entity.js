"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionEntity = void 0;
const entity_1 = require("./entity");
class TransactionEntity extends entity_1.Entity {
    constructor(id) {
        super("transaction", id);
        this.accountId = "";
        this.value = 0;
        this.date = Date.now();
    }
    setAccountId(accountId) {
        this.accountId = accountId;
    }
    setValue(value) {
        this.value = value;
    }
    setDate(date) {
        this.date = date;
    }
    getAccountId() {
        return this.accountId;
    }
    getValue() {
        return this.value;
    }
    getDate() {
        return this.date;
    }
}
exports.TransactionEntity = TransactionEntity;
