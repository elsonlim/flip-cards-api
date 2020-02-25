import mongoose, { Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const SALT_FACTOR = 12;

export interface User {
  username: string;
  password: string;
}

export interface UserMethods {
  comparePassword: (password: string) => Promise<boolean>;
  generateJWT: () => string;
}

export interface JwtPayload {
  name: string;
  iat: number;
}

export interface UserDocument extends Document, User, UserMethods {}

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
  },
  password: { type: String, required: true },
});

userSchema.pre<UserDocument>("save", async function(next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(SALT_FACTOR);
    const hash = await bcrypt.hash(this.password, salt);
    this.password = hash;
  }
  next();
});

userSchema.methods.comparePassword = async function(
  candidatePassword: string,
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateJWT = function(): string {
  const payload: JwtPayload = {
    name: this.username,
    iat: Math.floor(Date.now() / 1000),
  };

  const token = jwt.sign(payload, process.env.JWT_PW as string, {
    expiresIn: "10m",
  });
  return token;
};

export default mongoose.model<UserDocument>("User", userSchema);
