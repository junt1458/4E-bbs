import Head from 'next/head';
import { NextPage } from 'next';
import { useRequireLogin } from '../hooks/useLogin';
import AdminHeader from '../components/organisms/adminHeader';
import Header from '../components/organisms/header';

const AccountPage: NextPage = () => {
  const { isAuthChecking, currentUser } = useRequireLogin();

  // TODO: できること
  //   1. 名前の変更
  //   2. アイコンのアップロード
  //   3. bioの変更

  return (
    <>
      <Head>
        <title>BBS - Account</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminHeader user={currentUser} />
      <Header user={currentUser} />

      <span>Account Setting</span>
    </>
  );
};

export default AccountPage;
