import { z } from "zod";

export const updateUserInfoSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a vaild email address." })
    .toLowerCase(),
  name: z.string().nonempty({ message: "Name is required." }),
});

export const updateUserPassword = z
  .object({
    oldPassword: z
      .string()
      .min(6, { message: "Password must have at least 6 characters." }),
    newPassword: z
      .string()
      .min(6, { message: "Password must have at least 6 characters." }),
    confirmPassword: z.string({
      required_error: "Please enter password again.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match.",
    path: ["confirmPassword"],
  });

export const forgetPassword = z.object({
  email: z
    .string()
    .email({ message: "Please enter a vaild email address." })
    .toLowerCase(),
});

export const resetPassword = z
  .object({
    newPassword: z
      .string()
      .min(6, { message: "Password must have at least 6 characters." }),
    confirmNewPassword: z.string({
      required_error: "Please enter password again.",
    }),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match.",
    path: ["confirmNewPassword"],
  });
