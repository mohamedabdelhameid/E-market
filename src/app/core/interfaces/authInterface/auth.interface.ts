import { Metadata } from '../../../shared/interfaces/result/iresult.interface';

export interface SignUpAuth {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface UserRoot<T> {
  message: string;
  user?: T;
  token: string;
  users?: T;
  totalUsers?: number;
  metadata?: Metadata;
}

export interface User {
  name: string;
  email: string;
  role: string;
  phone?: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface JWTDecode {
  id: string;
  name: string;
  role: string;
  iat: number;
  exp: number;
}

export interface UpdatePassword {
  currentPassword: string;
  password: string;
  rePassword: string;
}

export interface IAllUsers {
  name: string;
  email: string;
  _id: string;
}
