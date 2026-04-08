export type User = {
  id: string;
  name?: string;
  avatar?: string;
  role?: string;
};

export type UserSignIn = {
  username: string;
  password: string;
};
