export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  gender: string;
  [key: string]: string | number;
}

export type Users = IUser[];