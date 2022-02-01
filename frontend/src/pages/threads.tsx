import Head from 'next/head';
import { NextPage } from 'next';
import { useRequireLogin } from '../hooks/useLogin';
import AdminHeader from '../components/organisms/adminHeader';
import Header from '../components/organisms/header';
import { useRouter } from 'next/router';

const ThreadsPage: NextPage = () => {
  const { isAuthChecking, currentUser } = useRequireLogin();
  const router = useRouter();
  if (!router.query || !router.query.id || isNaN(parseInt(router.query.id as string))) {
    router.push('/');
    return <></>;
  }

  // TODO: できること
  //   1. スレッド一覧の表示
  //   2. スレッドの作成
  //   3. スレッドの削除(モデレータのみ)

  return (
    <>
      <Head>
        <title>BBS - Threads</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminHeader user={currentUser} />
      <Header user={currentUser} />
      <span>Threads Page (id: {router.query.id})</span>
    </>
  );
};

export default ThreadsPage;
