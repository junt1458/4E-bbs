import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCurrentUser } from './useCurrentUser';

export const useRequireLogin = () => {
  const { isAuthChecking, currentUser } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (isAuthChecking) return; // まだ確認中
    if (!currentUser) router.push('/login'); // 未ログインだったのでリダイレクト
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthChecking, currentUser]);

  return { isAuthChecking, currentUser };
};

export const useRequireNotLogin = () => {
  const { isAuthChecking, currentUser } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (isAuthChecking) return; // まだ確認中
    if (currentUser != null) router.push('/'); // ログイン中だったのでリダイレクト
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthChecking, currentUser]);
};
