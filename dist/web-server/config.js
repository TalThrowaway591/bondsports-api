"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
require("dotenv/config");
const Config = {
    port: Number(process.env.PORT) || 3000
};
exports.Config = Config;
