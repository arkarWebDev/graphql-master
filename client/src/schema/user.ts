import { z } from "zod";

export const updateUserInfoSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a vaild email address." })
    .toLowerCase(),
  name: z.string().nonempty({ message: "Name is required." }),
});
