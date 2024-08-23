import mongoose from "mongoose";
import { UserRole } from "../enums/roles.enum";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  role: UserRole;
}