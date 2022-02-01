import { NextPage } from 'next';
import Head from 'next/head';
import RegisterTemplate from '../components/templates/registerTemplate';
import { useRequireNotLogin } from '../hooks/useLogin';

const HomePage: NextPage = () => {
  useRequireNotLogin();
  return (
    <>
      <Head>
        <title>BBS - Register</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <RegisterTemplate />
    </>
  );
};

export default HomePage;
