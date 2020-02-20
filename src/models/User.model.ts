import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
const SALT_FACTOR = 12;

export interface IUser {
  username: string;
  password: string;
  comparePassword: (password: string) => boolean;
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

userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUserDocument>("User", userSchema);
