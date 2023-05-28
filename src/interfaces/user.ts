import { MouseEventHandler } from 'react';

export interface IUser {
  id: number;
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

export interface IUserInfoProps extends Partial<IUser> {
  onClick?: MouseEventHandler<Element>;
  onAddTeammate?: (user: IUser) => void;
  isSearching?: boolean;
  isSelectingRole?: boolean;
  isProfile?: boolean;
}
