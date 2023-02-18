"use strict";
// WITHOUT DATABASE
Object.defineProperty(exports, "__esModule", { value: true });
// export default class Reminder {
//   isCompleted: boolean;
//   constructor(public readonly id: number, public title: string) {
//     this.isCompleted = false;
//   }
// }
// WITH DATABASE (MONGODB) using Mongoose 🍃
const mongoose_1 = require("mongoose");
const reminderSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    isCompleted: {
        type: Boolean,
        required: true,
        default: false,
    },
});
exports.default = (0, mongoose_1.model)("Reminder", reminderSchema);
