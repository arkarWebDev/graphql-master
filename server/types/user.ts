export type User = {
  _id?: string;
  name: string;
  email: string;
  password: string;
  role?: string[];
  avatar: {
    url: string;
    public_id: string;
  };
  resetPasswordToken: string | undefined;
  resetPasswordExpire: Date | undefined;
  createdAt: string;
  updatedAt: string;
};

export type UserInput = {
  name: string;
  email: string;
  password: string;
  role?: string[];
};
