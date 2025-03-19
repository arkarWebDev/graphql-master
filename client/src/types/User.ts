export type User = {
  id?: string;
  name: string;
  email: string;
  role?: string[];
  avatar: {
    url: string;
    public_id: string;
  };
  createdAt: string;
  updatedAt: string;
};
