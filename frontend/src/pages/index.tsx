import Head from 'next/head';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import { useSetRecoilState } from 'recoil';
import { NextPage } from 'next';
import { useRequireLogin } from '../hooks/useLogin';
import { currentUserState } from '../states/currentUser';
import AdminHeader from '../components/organisms/adminHeader';
import Header from '../components/organisms/header';
import IndexTemplate from '../components/templates/indexTemplate';

const CategoryPage: NextPage = () => {
  const { isAuthChecking, currentUser } = useRequireLogin();

  return (
    <>
      <Head>
        <title>BBS - Top</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <AdminHeader user={currentUser} />
      <Header user={currentUser} />
      <IndexTemplate />
    </>
  );
};

export default CategoryPage;
