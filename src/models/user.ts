export type UserInfo = {
  id: number;
  lastName: string;
  firstName: string;
  email: string;
};

export type UserLogin = {
  email: string;
  password: string;
};

export type UserToken = {
  accessToken: string;
};

export type UserSignUp = {
  lastName: string;
  firstName: string;
  email: string;
  password: string;
};
