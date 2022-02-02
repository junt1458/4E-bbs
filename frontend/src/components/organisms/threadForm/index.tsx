import { Button, CircularProgress, TextField } from '@mui/material';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { User } from '../../../types/user';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { useState } from 'react';
import { SERVER_URI } from '../../../utils/constants';
import { getAccessToken } from '../../../utils/currentUser';
import { Thread } from '../../../types/thread';

const ThreadForm: React.FunctionComponent<{ thread: Thread | null; onPosted(): Promise<void> }> = ({
  thread,
  onPosted,
}) => {
  const { isAuthChecking, currentUser } = useCurrentUser();
  const [posting, setPosting] = useState(false);

  const handlePost = async () => {
    // TODO: Handle Attachments.
    const textValInput = document.getElementById('thread_post');
    if (!textValInput) return;
    const text = (textValInput as HTMLInputElement).value;
    if (!text) {
      alert('投稿内容が入力されていません。');
      return;
    }
    setPosting(true);

    const postData = {
      id: thread?.id,
      content: text,
    };
    const response = await fetch(SERVER_URI + '/thread/post', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': await getAccessToken(),
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      alert('エラーが発生しました。');
      setPosting(false);
      return;
    }

    (textValInput as HTMLInputElement).value = '';
    await onPosted();
    setPosting(false);
  };

  return (
    <div className='mx-auto my-8 max-w-xl p-3'>
      <div className='h-full w-full rounded-lg border-2 border-neutral-600 p-4'>
        <div className='mb-3 bg-zinc-100'>
          <TextField
            id='thread_post'
            label='内容'
            variant='outlined'
            multiline
            rows={5}
            className='h-full w-full'
          />
        </div>
        <div>ファイル添付 (20MBまで)(未実装)</div>
        {isAuthChecking || (currentUser != null && (currentUser as User).rank < 2) ? (
          <div className='my-2 pl-2'>
            <span className='text-red-500'>
              <DangerousIcon />
            </span>
            ファイルの添付は認証ユーザー以上が使用可能です。
          </div>
        ) : (
          <></>
        )}
        <div className='mt-2 w-full'>
          <Button
            variant='contained'
            component='label'
            color='secondary'
            disabled={posting || isAuthChecking || (currentUser as User).rank < 2}
          >
            Upload File
            <input type='file' hidden />
          </Button>
          <span className='ml-2'>(ファイル未選択)</span>
        </div>
        <div className='mx-auto mt-8 w-full'>
          <Button
            variant='contained'
            color='primary'
            className='w-full'
            disabled={posting}
            onClick={handlePost}
          >
            {posting ? <CircularProgress color='inherit' size={18} className='mr-3' /> : null}
            投稿
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThreadForm;
