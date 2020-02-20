import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const SALT_FACTOR = 12;

export interface IUser {
  username: string;
  password: string;
}

export interface IUserMethods {
  comparePassword: (password: string) => boolean;
  generateJWT: () => string;
}

export interface IUserDocument extends Document, IUser, IUserMethods {}

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
userSchema.methods.generateJWT = async function() {
  const token = await jwt.sign(
    {
      name: this.username,
      iat: Math.floor(Date.now() / 1000),
    },
    process.env.JWT_PW as string,
    {
      expiresIn: "10m",
    },
  );
  return token;
};

export default mongoose.model<IUserDocument>("User", userSchema);
