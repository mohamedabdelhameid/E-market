export interface SignUpAuth {
  name: string;
  email: string;
  password: string;
  rePassword: string;
  phone: string;
}

export interface UserRoot<T> {
  message: string;
  user: T;
  token: string;
}

export interface User {
  name: string;
  email: string;
  role: string;
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
