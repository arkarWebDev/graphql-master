import { Response } from "express";
import { User } from "../models/user";
import { User as UserType, UserInput } from "../types/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import errorHandler from "../middlewares/errorHandler";
import { deleteImage, uploadSingleImage } from "../util/cloudinary";

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

export const uploadAvatar = errorHandler(
  async (image: string, userId: string) => {
    const userDoc = await User.findById(userId);

    if (!userDoc) {
      throw new Error("User not found.");
    }

    const response = await uploadSingleImage(image, "baganhotel/avatar");

    if (userDoc.avatar?.public_id) {
      await deleteImage(userDoc.avatar?.public_id);
    }

    await User.findByIdAndUpdate(userId, {
      avatar: {
        url: response.img_url,
        public_id: response.public_id,
      },
    });

    return true;
  }
);

export const updateUserProfile = errorHandler(
  async (userInfo: Partial<UserInput>, userId: string) => {
    const userDoc = await User.findById(userId);

    if (!userDoc) {
      throw new Error("User not found.");
    }

    userDoc.set(userInfo).save();

    return true;
  }
);
