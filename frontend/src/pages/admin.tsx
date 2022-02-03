import Head from 'next/head';
import { NextPage } from 'next';
import { useRequireLogin } from '../hooks/useLogin';
import AdminHeader from '../components/organisms/adminHeader';
import Header from '../components/organisms/header';
import { useRouter } from 'next/router';
import AdminTemplate from '../components/templates/adminTemplate';

const AdminPage: NextPage = () => {
  const { isAuthChecking, currentUser } = useRequireLogin();
  const router = useRouter();

  // TODO: できること
  //   1. カテゴリの追加/削除
  //   2. 新規登録のオン/オフ
  //   3. ユーザーランクの管理

  if (!isAuthChecking && currentUser && currentUser.rank < 4) {
    router.push('/');
  }
  return !isAuthChecking && currentUser && currentUser.rank >= 4 ? (
    <>
      <Head>
        <title>BBS - Admin</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminHeader user={currentUser} />
      <Header user={currentUser} />
      <AdminTemplate />
    </>
  ) : (
    <></>
  );
};

export default AdminPage;
