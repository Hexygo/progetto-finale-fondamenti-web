"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: { type: String, unique: true },
    password: String,
    friends: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }],
    requests: [{ type: mongoose_1.default.Types.ObjectId, ref: "User" }]
});
module.exports = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=User.js.map