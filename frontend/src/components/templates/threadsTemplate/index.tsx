import { Button } from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { SERVER_URI } from '../../../utils/constants';
import { getAccessToken } from '../../../utils/currentUser';
import { Category } from '../../organisms/categoryList/interface';
import ThreadList from '../../organisms/threadList';
import { Thread } from '../../organisms/threadList/interface';

const ThreadsTemplate: React.FunctionComponent = () => {
  // TODO: できること
  //   1. スレッド一覧の表示
  //   2. スレッドの作成
  //   3. スレッドの削除(モデレータのみ) → スレッド内メニューに移動
  const [threads, setThreads] = useState<Thread[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(SERVER_URI + '/thread/list?id=' + router.query.id, {
        method: 'GET',
        headers: {
          'X-Access-Token': await getAccessToken(),
        },
      });

      if (!response.ok) {
        router.replace('/');
        return;
      }

      const data = await response.json();
      setThreads(data.threads as Thread[]);
      setCategory(data.category as Category);
    }
    if (router.query == null || router.query.id == null) return;
    fetchData();
  }, [router]);

  if (router.query == null || router.query.id == null) {
    router.replace('/');
    return <></>;
  }

  return (
    <>
      <h1 className='px-2 py-4 text-center text-3xl'>スレッド一覧</h1>
      <h2 className='px-2 py-4 text-center text-xl'>{category != null ? category.title : ""}</h2>
      <div className='flex justify-center'>
        <Button color="primary" variant='contained'>スレッド作成</Button>
      </div>
      <ThreadList threads={threads} />
    </>
  );
};

export default ThreadsTemplate;
