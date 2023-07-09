import usersData from '../data/users.json';
import { Users } from '../types/User';

export const getUsers = (): Promise<Users> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(usersData);
    }, 1000);
  })
}