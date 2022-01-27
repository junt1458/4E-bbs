import { useRecoilValue } from 'recoil';
import { currentUserState } from '../states/currentUser';

export const useCurrentUser = () => {
  const currentUser = useRecoilValue(currentUserState);
  const isAuthChecking = currentUserState === undefined;

  return {
    currentUser,
    isAuthChecking,
  };
};
