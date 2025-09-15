import { BaseEntity } from "./base";

export type UserInfo = {
  email: string;
  fullName: string;
  phone?: string;
  photoUrl?: string;
} & BaseEntity;

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
