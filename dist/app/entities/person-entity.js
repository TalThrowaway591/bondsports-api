"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PersonEntity = void 0;
const entity_1 = require("./entity");
class PersonEntity extends entity_1.Entity {
    constructor(id) {
        super("person", id);
        this.name = "";
        this.document = "";
        this.birthDate = Date.now();
    }
    setName(name) {
        this.name = name;
    }
    setDocument(document) {
        this.document = document;
    }
    setBirthDate(birthDate) {
        this.birthDate = birthDate;
    }
    getName() {
        return this.name;
    }
    getDocument() {
        return this.document;
    }
    getBirthDate() {
        return this.birthDate;
    }
}
exports.PersonEntity = PersonEntity;
