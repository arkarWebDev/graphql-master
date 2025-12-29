import { Response } from "express";
import { User } from "../models/user";
import { IUser, UserInput } from "../types/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import errorHandler from "../middlewares/errorHandler";
import { deleteImage, uploadSingleImage } from "../util/cloudinary";
import { forgetPasswordEmailTemplate } from "../util/forget-emal";
import { SendEmail } from "../util/sendEmail";
import crypto from "crypto";

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
      sameSite: "none",
      secure: true,
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

export const updateUserPassword = errorHandler(
  async (oldPassword: string, newPassword: string, userId: string) => {
    const userDoc = await User.findById(userId).select("+password");

    if (!userDoc) {
      throw new Error("User not found.");
    }

    const isMatch = await bcrypt.compare(oldPassword, userDoc.password);

    if (!isMatch) {
      throw new Error("Old password is wrong!");
    }

    userDoc.password = newPassword;
    await userDoc.save();

    return true;
  }
);

export const forgetPassword = errorHandler(async (customer_email: string) => {
  const user = await User.findOne({ email: customer_email });

  if (!user) {
    throw new Error("User not found.");
  }

  const token = user.generatePasswordResetToken();
  await user.save();

  const reset_url = `${process.env.CLIENT_URL}/reset-password/${token}`;

  const body = forgetPasswordEmailTemplate(reset_url);

  try {
    await SendEmail({
      customer_email: user.email,
      subject: "Bagan Hotel Password Reset",
      body,
    });
  } catch (error: any) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    throw new Error(error?.message);
  }
  return true;
});

export const resetPassword = errorHandler(
  async (token: string, newPassword: string, confirmNewPassword: string) => {
    const reset_token = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: reset_token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      throw new Error("Token is invaild");
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error("Password don't match.");
    }

    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    return true;
  }
);
