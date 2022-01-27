import { CurrentUser } from '../types/user';

export const fetchCurrentUser = async (): Promise<CurrentUser> => {
  return {
    name: 'test',
    email: 'test@example.com',
    refresh_token: 'test2',
    access_token: 'test3',
  };
};
