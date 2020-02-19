import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
const SALT_FACTOR = 12;

export interface IUser {
  username: string;
  password: string;
}

export interface IUserDocument extends Document, IUser {}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: { type: String, required: true },
});

userSchema.pre<IUserDocument>("save", async function(next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  next();
});
export default mongoose.model<IUserDocument>("User", userSchema);
