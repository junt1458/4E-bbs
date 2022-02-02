import { Button, CircularProgress, TextField } from '@mui/material';
import DangerousIcon from '@mui/icons-material/Dangerous';
import { User } from '../../../types/user';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import React, { useState } from 'react';
import { SERVER_URI } from '../../../utils/constants';
import { getAccessToken } from '../../../utils/currentUser';
import { Thread } from '../../../types/thread';
import { parse } from 'path';

const ThreadForm: React.FunctionComponent<{ thread: Thread | null; onPosted(): Promise<void> }> = ({
  thread,
  onPosted,
}) => {
  const { isAuthChecking, currentUser } = useCurrentUser();
  const [posting, setPosting] = useState(false);
  const [fileMessage, setFileMessage] = useState('(ファイル未選択)');
  const [fileError, setFileError] = useState('');

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const files = e.target.files;
    if (!files) return;

    let total = 0;
    for (let i = 0; i < files.length; i++) {
      total += files[i].size;
    }

    setFileError('');
    if (files.length <= 0) {
      setFileMessage(`(ファイル未選択)`);
    } else {
      setFileMessage(`${files.length} 件のファイルが選択されています。`);
    }
    if (total >= 256 * 1024 * 1024) {
      setFileError('ファイルサイズの合計が256MBを超えています。');
      for (let i = 0; i < document.forms.length; i++) {
        const form = document.forms[i];
        if (form.name === 'fileForm') {
          form.reset();
          break;
        }
      }
    }
  };

  const fileToURL = (blob: Blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (!event || !event.target) {
          reject();
          return;
        }
        resolve(event.target.result);
      };
      reader.readAsDataURL(blob);
    });
  };

  const resetFile = () => {
    for (let i = 0; i < document.forms.length; i++) {
      setFileMessage(`(ファイル未選択)`);
      setFileError('');
      const form = document.forms[i];
      if (form.name === 'fileForm') {
        form.reset();
        break;
      }
    }
  };

  const handlePost = async () => {
    const attachments = [];
    const fileForm = document.getElementById('file_form');
    const textValInput = document.getElementById('thread_post');
    if (!textValInput || !fileForm) return;
    setPosting(true);

    const files = (fileForm as HTMLInputElement).files;
    if (files != null) {
      for (let i = 0; i < files.length; i++) {
        const dataUrl = await fileToURL(files[i]);
        attachments.push({
          filename: parse(files[i].name).name,
          data: (dataUrl as string).split(',')[1],
        });
      }
    }

    const text = (textValInput as HTMLInputElement).value;
    if (!text) {
      alert('投稿内容が入力されていません。');
      setPosting(false);
      return;
    }

    const postData = {
      id: thread?.id,
      content: text,
      attachments: attachments,
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
    for (let i = 0; i < document.forms.length; i++) {
      setFileMessage(`(ファイル未選択)`);
      setFileError('');
      const form = document.forms[i];
      if (form.name === 'fileForm') {
        form.reset();
        break;
      }
    }
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
        <div>ファイル添付 (合計256MBまで)</div>
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
        <span className={'my-2 block ' + (fileError != '' ? 'text-red-500' : '')}>
          {fileError != '' ? fileError : fileMessage}
        </span>
        <div className='mt-2 w-full'>
          <form name='fileForm' onSubmit={() => false}>
            <Button
              variant='contained'
              component='label'
              color='secondary'
              disabled={posting || isAuthChecking || (currentUser as User).rank < 2}
            >
              ファイルの添付
              <input type='file' id='file_form' hidden multiple onChange={handleFileSelected} />
            </Button>
            &nbsp;
            <Button
              variant='contained'
              component='label'
              color='info'
              onClick={resetFile}
              disabled={posting || isAuthChecking || (currentUser as User).rank < 2}
            >
              選択解除
            </Button>
          </form>
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
