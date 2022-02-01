import { parseCookies, setCookie } from 'nookies';
import CircularProgress from '@mui/material/CircularProgress';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import PasswordIcon from '@mui/icons-material/Password';
import { Button, Tooltip } from '@mui/material';
import { useEffect, useState } from 'react';
import { SERVER_URI } from '../../../utils/constants';
import { useSetRecoilState } from 'recoil';
import { currentUserState } from '../../../states/currentUser';
import { fetchCurrentUser } from '../../../utils/currentUser';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import IconInput from '../../atoms/iconInput';
import { useRouter } from 'next/router';

const RegisterForm: React.FunctionComponent = () => {
  const router = useRouter();
  const [error, setError] = useState<string>('');
  const [isRegistering, setRegistering] = useState<boolean>(false);
  const setCurrentUser = useSetRecoilState(currentUserState);

  const onClickRegister = () => {
    const name_input = document.getElementById('register_name');
    const id_input = document.getElementById('register_id');
    const pass_input = document.getElementById('register_password');
    if (name_input == null || id_input == null || pass_input == null) {
      setError('フォームの値を取得できませんでした。');
      return;
    }
    const name = (id_input as HTMLInputElement).value;
    const id = (id_input as HTMLInputElement).value;
    const pass = (pass_input as HTMLInputElement).value;

    if (!name || !id || !pass) {
      setError('入力されていない値があります。');
      return;
    }

    setError('');
    setRegistering(true);

    async function tryRegister(name: string, id: string, pass: string) {
      const postData = { name, id, pass };
      const response = await fetch(SERVER_URI + '/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      setRegistering(false);

      if (!response.ok) {
        if (response.status === 403) {
          setError('許可されていない操作です。');
        } else {
          setError('既に登録されているユーザー名です。');
        }
        return;
      }

      setCookie(null, 'access_token', data.access_token);
      setCookie(null, 'refresh_token', data.refresh_token);

      try {
        const currentUser = await fetchCurrentUser();
        setCurrentUser(currentUser);
      } catch {
        setCurrentUser(null);
      }

      router.push('/');
    }
    tryRegister(name, id, pass);
  };

  const onClickLogin = () => {
    router.push('/login');
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(SERVER_URI + '/auth/register', {
        method: 'GET',
      });
      const data = await response.json();
      if (!data.register_open) {
        router.push('/login');
      }
    }
    fetchData();
  }, [router]);

  return (
    <div className='grid text-center'>
      <div className='mx-auto my-2 grid-rows-1'>
        <IconInput
          icon={<DriveFileRenameOutlineIcon />}
          max_width={350}
          placeholder='名前'
          type='text'
          id='register_name'
          autocomplete='name'
        />
      </div>
      <div className='mx-auto my-2 grid-rows-1'>
        <IconInput
          icon={<AccountBoxIcon />}
          max_width={350}
          placeholder='ユーザーID'
          type='text'
          id='register_id'
          autocomplete='username'
        />
      </div>
      <div className='mx-auto my-2 grid-rows-1'>
        <IconInput
          icon={<PasswordIcon />}
          max_width={350}
          placeholder='パスワード'
          type='password'
          id='register_password'
          autocomplete='current-password'
          onEnterPressed={onClickLogin.bind(this)}
        />
      </div>

      <div className='mx-auto mt-4 mb-3 w-screen' style={{ maxWidth: '350px' }}>
        <Button
          variant='contained'
          color='primary'
          className='w-full'
          onClick={onClickRegister.bind(this)}
          disabled={isRegistering}
        >
          {isRegistering ? <CircularProgress color='inherit' size={18} className='mr-3' /> : null}
          新規登録
        </Button>
      </div>
      <span className='mb-8 text-red-500'>{error}</span>
      <span className='mt-3 text-lg'>以前にご利用されたことがありますか?</span>
      <div className='mx-auto mt-4 mb-8 w-screen' style={{ maxWidth: '350px' }}>
        <Button
          variant='contained'
          color='secondary'
          className='w-full'
          onClick={onClickLogin.bind(this)}
        >
          ログイン
        </Button>
      </div>
    </div>
  );
};

export default RegisterForm;
