import Head from 'next/head';
import { NextPage } from 'next';
import { useRequireLogin } from '../hooks/useLogin';
import AdminHeader from '../components/organisms/adminHeader';
import Header from '../components/organisms/header';

const UserPage: NextPage = () => {
  const { isAuthChecking, currentUser } = useRequireLogin();

  // TODO: できること
  //   1. ユーザー情報の表示

  return (
    <>
      <Head>
        <title>BBS - User</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminHeader user={currentUser} />
      <Header user={currentUser} />
      <span>User info</span>
    </>
  );
};

export default UserPage;
