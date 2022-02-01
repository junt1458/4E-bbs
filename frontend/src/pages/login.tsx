import { NextPage } from 'next';
import Head from 'next/head';
import LoginTemplate from '../components/templates/loginTemplate';
import { useRequireNotLogin } from '../hooks/useLogin';

const LoginPage: NextPage = () => {
  useRequireNotLogin();
  return (
    <>
      <Head>
        <title>BBS - Login</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <LoginTemplate />
    </>
  );
};

export default LoginPage;
