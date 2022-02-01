import Link from 'next/link';
import { Divider } from '@mui/material';
import { useRouter } from 'next/router';
import { destroyCookie, parseCookies } from 'nookies';
import { useState } from 'react';
import { useSetRecoilState } from 'recoil';
import { currentUserState } from '../../../states/currentUser';
import { SERVER_URI } from '../../../utils/constants';
import RoundIcon from '../../atoms/roundIcon';
import SettingsIcon from '@mui/icons-material/Settings';
import { HeaderProps } from './interface';

const Header: React.FunctionComponent<HeaderProps> = (props) => {
  const [menu, setMenu] = useState(false);
  const setCurrentUser = useSetRecoilState(currentUserState);
  const router = useRouter();

  const onClickLogout = async () => {
    if (confirm('ログアウトしますか？')) {
      // アクセストークンの破棄
      const cookies = parseCookies();
      if (cookies.access_token != null && cookies.refresh_token != null) {
        const postBody = {
          access_token: cookies.access_token,
          refresh_token: cookies.refresh_token,
        };
        const res = await fetch(SERVER_URI + '/auth/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postBody),
        });
      }
      destroyCookie(null, 'access_token');
      destroyCookie(null, 'refresh_token');
      setCurrentUser(null);
      router.push('/');
    }
  };

  return (
    <div className='flex h-12 w-screen items-center justify-between bg-sky-200'>
      <div className='pl-3 text-3xl'>
        <Link href='/'>
          <a>BBS</a>
        </Link>
      </div>
      <div className='h-12 w-12 p-1'>
        <a
          href='#'
          onClick={(e) => {
            e.preventDefault();
            setMenu(!menu);
          }}
        >
          <RoundIcon size={40} src='/test.jpg' />
        </a>
        <div
          className='mt-1 rounded-lg border-2 border-gray-400 bg-gray-100 p-1'
          style={{ width: 180, position: 'absolute', right: 5, display: menu ? 'block' : 'none' }}
        >
          <ul>
            <li className='p-1'>ようこそ、{props.user?.name}さん</li>
            <li className='py-1'>
              <Divider />
            </li>
            <li className='p-1'>
              <Link href='/account'>
                <a>
                  <SettingsIcon fontSize='small' />
                  アカウント設定
                </a>
              </Link>
            </li>
            <li className='py-1'>
              <Divider />
            </li>
            <li className='p-1'>
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  onClickLogout();
                }}
              >
                ログアウト
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
