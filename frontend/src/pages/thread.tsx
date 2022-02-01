import Head from 'next/head';
import { NextPage } from 'next';
import { useRequireLogin } from '../hooks/useLogin';
import AdminHeader from '../components/organisms/adminHeader';
import Header from '../components/organisms/header';

const ThreadPage: NextPage = () => {
  const { isAuthChecking, currentUser } = useRequireLogin();

  // TODO: できること
  //   1. スレッドの表示
  //   2. メッセージの送信
  //   3. メッセージの編集 (自分のもののみ)
  //   4. メッセージの編集・削除(モデレータのみ)
  //   5. ファイルアップロード (認証ユーザーのみ)

  return (
    <>
      <Head>
        <title>BBS - Thread</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminHeader user={currentUser} />
      <Header user={currentUser} />
      <span>Thread info</span>
    </>
  );
};

export default ThreadPage;
