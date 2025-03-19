import { Response } from "express";
import { User } from "../models/user";
import { UserInput } from "../types/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import errorHandler from "../middlewares/errorHandler";

export const register = errorHandler(async (userInput: UserInput) => {
  const { email, password, name } = userInput;

  return await User.create({
    name,
    password,
    email,
  });
});

export const login = errorHandler(
  async (email: string, password: string, res: Response) => {
    const userDoc = await User.findOne({ email }).select("+password");

    if (!userDoc) {
      throw new Error("Invaild Email or Password.");
    }

    const isPassMatch = await bcrypt.compare(password, userDoc.password);

    if (!isPassMatch) {
      throw new Error("Invaild Email or Password.");
    }

    const token = jwt.sign({ _id: userDoc._id }, process.env.JWT_SECRET!, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return userDoc;
  }
);
