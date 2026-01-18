"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Entity = void 0;
const nanoid_1 = require("nanoid");
class Entity {
    constructor(prefix, id) {
        this.prefix = prefix;
        this.id = id !== null && id !== void 0 ? id : `${prefix}-${(0, nanoid_1.nanoid)(8)}`;
    }
    getId() {
        return this.id;
    }
    getPrefix() {
        return this.prefix;
    }
}
exports.Entity = Entity;
