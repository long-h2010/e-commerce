export type User = {
  id: string;
  phoneNumber?: string;
  email?: string;
  name?: string;
  avatar?: string;
};

export type UserSignIn = {
  username: string;
  password: string;
};

export type UserSignUp = {
  username: string;
  name: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
};

export type UserDisplay = {
  id: string;
  name: string;
  avatar: string;
};
