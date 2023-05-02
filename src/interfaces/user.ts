export interface IUser {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface IUserSignup {
  email: string;
  name: string;
  password: string;
  confirmPassword?: string;
}

export interface IUserSignin {
  email: string;
  password: string;
}