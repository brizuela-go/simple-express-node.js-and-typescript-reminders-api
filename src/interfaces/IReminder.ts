import { Document } from "mongoose";

export default interface IReminder extends Document {
  title: string;
  isCompleted: boolean;
}
