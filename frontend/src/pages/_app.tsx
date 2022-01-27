import '../styles/globals.css';
import React from 'react';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useSetRecoilState, RecoilRoot } from 'recoil';
import { currentUserState } from '../states/currentUser';
import { fetchCurrentUser } from '../utils/currentUser';

const AppInit: React.FunctionComponent = () => {
  const setCurrentUser = useSetRecoilState(currentUserState);
  
  useEffect(() => {
    (async function() {
      try {
        const currentUser = await fetchCurrentUser();
        setCurrentUser(currentUser);
      } catch {
        setCurrentUser(null);
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return null;
};

const MyApp = ({ Component, pageProps, router }: AppProps) => {
  return (
    <RecoilRoot>
      <Component {...pageProps} />
      <AppInit />
    </RecoilRoot>
  );
};

export default MyApp;
