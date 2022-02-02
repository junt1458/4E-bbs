import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Category } from '../../../types/category';
import { Thread } from '../../../types/thread';
import { SERVER_URI } from '../../../utils/constants';
import { getAccessToken } from '../../../utils/currentUser';
import ThreadList from '../../organisms/threadList';

const ThreadsTemplate: React.FunctionComponent = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [open, setOpen] = useState(false);
  const [disable, setDisable] = useState(false);
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

  const handleCancel = () => {
    const title = document.getElementById('thread_title');
    if (title == null) return;
    (title as HTMLInputElement).value = '';
    setOpen(false);
  };

  const handleCreate = async () => {
    setDisable(true);
    const title = document.getElementById('thread_title');
    if (title == null) return;
    const name = (title as HTMLInputElement).value;
    if (name == null) {
      alert('タイトルが入力されていません。');
      setDisable(false);
      return;
    }
    const postBody = {
      name: name,
      category_id: category?.id,
    };
    const response = await fetch(SERVER_URI + '/thread/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': await getAccessToken(),
      },
      body: JSON.stringify(postBody),
    });
    if (!response.ok) {
      alert('作成中にエラーが発生しました。');
      setDisable(false);
      return;
    }
    const data = await response.json();
    const tid = data.thread_id;
    router.push('/thread?id=' + tid);
    setDisable(false);
    setOpen(false);
  };

  return (
    <>
      <h1 className='px-2 py-4 text-center text-3xl'>スレッド一覧</h1>
      <h2 className='px-2 py-4 text-center text-xl'>{category != null ? category.title : ''}</h2>
      <div className='flex justify-center'>
        <Button color='primary' variant='contained' onClick={() => setOpen(true)}>
          スレッド作成
        </Button>
      </div>
      <ThreadList threads={threads} />
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>スレッドの作成</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='thread_title'
            label='スレッドタイトル'
            type='text'
            fullWidth
            variant='standard'
            onKeyDown={(e) => {
              if (e.keyCode == 13) handleCreate();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancel}>キャンセル</Button>
          <Button onClick={handleCreate}>作成</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ThreadsTemplate;
