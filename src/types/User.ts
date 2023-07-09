export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  gender: string;
}

export type Users = IUser[];