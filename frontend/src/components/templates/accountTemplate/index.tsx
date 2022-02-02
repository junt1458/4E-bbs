import Image from 'next/image';
import { Button, TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { currentUserState } from '../../../states/currentUser';
import { SERVER_URI } from '../../../utils/constants';
import { fetchCurrentUser, getAccessToken } from '../../../utils/currentUser';
import { getRandomInt } from '../../../utils/random';

const AccountTemplate: React.FunctionComponent = () => {
  const setCurrentUser = useSetRecoilState(currentUserState);
  const { isAuthChecking, currentUser } = useCurrentUser();
  const [posting, setPosting] = useState(false);
  const [name, setName] = useState('');
  const [rnd, setRandom] = useState(getRandomInt(10000000, 100000000));

  useEffect(() => {
    setName(currentUser != null ? currentUser.name : '');
  }, [currentUser]);

  const handleUpdate = async () => {
    setPosting(true);
    const postData = {
      name: name,
    };

    const response = await fetch(SERVER_URI + '/profile/update', {
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

    setCurrentUser(await fetchCurrentUser());
    setPosting(false);
  };

  const handleIconChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setPosting(true);
    const formData = new FormData();
    formData.append('icon', e.target.files[0]);
    const response = await fetch(SERVER_URI + '/profile/icon', {
      method: 'POST',
      headers: {
        "X-Access-Token": await getAccessToken()
      },
      body: formData,
    });

    const frm = document.forms;
    if (frm != null) {
      for (let i = 0; i < frm.length; i++) {
        const f = frm[i];
        if (f.name === 'iconForm') {
          f.reset();
        }
      }
    }

    if (!response.ok) {
      alert('エラーが発生しました。');
      setPosting(false);
      return;
    }

    setRandom(getRandomInt(10000000, 100000000));
    setPosting(false);
  };

  return (
    <div className='flex min-h-screen items-center justify-center overflow-auto'>
      <div>
        <h1 className='text-center text-2xl'>アカウント設定の変更</h1>
        <div className='w-64 p-4 pb-0'>
          <TextField
            autoFocus
            margin='dense'
            label='ユーザー名'
            type='name'
            fullWidth
            variant='standard'
            value={name}
            onChange={(e) => {
              if (!posting) setName(e.target.value);
            }}
          />
        </div>
        <div className='mx-auto mb-8 w-64 p-4'>
          <Button
            variant='contained'
            color='primary'
            className='w-full'
            onClick={handleUpdate}
            disabled={posting}
          >
            名前の更新
          </Button>
        </div>

        <div className='mx-auto h-48 w-48 border'>
          <Image
            width={192}
            height={192}
            src={'/api/icon/' + currentUser?.id + '?rnd=' + rnd}
            alt='User icon'
          />
        </div>
        <div className='mx-auto w-64 p-4'>
          <form name='iconForm' onSubmit={() => false}>
            <Button
              variant='contained'
              color='primary'
              component='label'
              className='w-full'
              disabled={posting}
            >
              アイコンの変更
              <input type='file' hidden accept='image/jpg,image/png' onChange={handleIconChange} />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountTemplate;
