"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const messageSchema = new mongoose_1.default.Schema({
    sender: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose_1.default.Types.ObjectId, ref: "User" },
    content: String,
    time: Date
});
module.exports = mongoose_1.default.model('Message', messageSchema);
//# sourceMappingURL=Message.js.map