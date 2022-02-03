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
import IconInput from '../../atoms/iconInput';
import { useRouter } from 'next/router';

const LoginForm: React.FunctionComponent = () => {
  const router = useRouter();
  const [registerStatus, setRegisterStatus] = useState<0 | 1 | 2>(0);
  const [error, setError] = useState<string>('');
  const [isLoggingin, setIsLoggingin] = useState<boolean>(false);
  const setCurrentUser = useSetRecoilState(currentUserState);

  const onClickLogin = () => {
    const id_input = document.getElementById('login_id');
    const pass_input = document.getElementById('login_password');
    if (id_input == null || pass_input == null) {
      setError('フォームの値を取得できませんでした。');
      return;
    }
    const id = (id_input as HTMLInputElement).value;
    const pass = (pass_input as HTMLInputElement).value;

    if (!id || !pass) {
      setError('入力されていない値があります。');
      return;
    }

    setError('');
    setIsLoggingin(true);

    async function tryLogin(id: string, pass: string) {
      const postData = { id, pass };
      const response = await fetch(SERVER_URI + '/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const data = await response.json();
      setIsLoggingin(false);

      if (!response.ok) {
        setError('ログインに失敗しました。');
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
    tryLogin(id, pass);
  };

  const onClickRegister = () => {
    if (registerStatus !== 1) return;
    router.push('/register');
  };

  useEffect(() => {
    if(!router.query)
      return;
    
    if(!router.query.err)
      return;

    if(isNaN(parseInt(router.query.err as string)))
      return;

    const errNo = parseInt(router.query.err as string);
    if(errNo == 1)
      setError("アカウント認証に失敗しました。");
    else if(errNo == 2)
      setError("登録されていないアカウントです。");
    
    router.replace('/login');
  }, [router]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(SERVER_URI + '/auth/register', {
        method: 'GET',
      });
      const data = await response.json();
      setRegisterStatus(data.register_open ? 1 : 2);
    }
    if (registerStatus !== 0) return;
    fetchData();
  }, [registerStatus]);

  return (
    <div className='grid text-center'>
      <div className='mx-auto my-2 grid-rows-1'>
        <IconInput
          icon={<AccountBoxIcon />}
          max_width={350}
          placeholder='ユーザーID'
          type='text'
          id='login_id'
          autocomplete='username'
        />
      </div>
      <div className='mx-auto my-2 grid-rows-1'>
        <IconInput
          icon={<PasswordIcon />}
          max_width={350}
          placeholder='パスワード'
          type='password'
          id='login_password'
          autocomplete='current-password'
          onEnterPressed={onClickLogin.bind(this)}
        />
      </div>

      <div className='mx-auto mt-4 mb-3 w-screen' style={{ maxWidth: '350px' }}>
        <Button
          variant='contained'
          color='primary'
          className='w-full'
          onClick={onClickLogin.bind(this)}
          disabled={isLoggingin}
        >
          {isLoggingin ? <CircularProgress color='inherit' size={18} className='mr-3' /> : null}
          ログイン
        </Button>
      </div>
      <span className='mb-8 text-red-500'>{error}</span>
      <span className='mt-3 text-lg'>初めてのご利用ですか?</span>
      <div className='mx-auto mt-4 mb-8 w-screen' style={{ maxWidth: '350px' }}>
        <Tooltip title={registerStatus === 2 ? '現在新規登録はオフに設定されています。' : ''} arrow>
          <span>
            <Button
              variant='contained'
              color='secondary'
              disabled={registerStatus !== 1}
              className='w-full'
              onClick={onClickRegister.bind(this)}
            >
              {registerStatus === 0 ? (
                <CircularProgress color='inherit' size={18} className='mr-3' />
              ) : null}
              新規登録
            </Button>
          </span>
        </Tooltip>
      </div>
    </div>
  );
};

export default LoginForm;
