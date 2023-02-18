// WITHOUT DATABASE

// export default class Reminder {
//   isCompleted: boolean;

//   constructor(public readonly id: number, public title: string) {
//     this.isCompleted = false;
//   }
// }

// WITH DATABASE (MONGODB) using Mongoose 🍃

import { Schema, model } from "mongoose";
import IReminder from "../interfaces/IReminder";

const reminderSchema = new Schema({
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

export default model<IReminder>("Reminder", reminderSchema);
