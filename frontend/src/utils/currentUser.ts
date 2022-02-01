import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { User } from '../types/user';
import { SERVER_URI } from './constants';

export const getAccessToken = async (): Promise<string> => {
  try {
    // クライアント側では署名の確認を行わない
    const cookies = parseCookies();
    const now = Math.floor(new Date().getTime() / 1000);

    if (cookies.access_token) {
      const token = cookies.access_token.split('.');
      if (token.length === 3) {
        const payload = JSON.parse(Buffer.from(token[1], 'base64').toString());
        if (payload.type && payload.type === 'access') {
          if (payload.exp <= now) {
            // token expired
            console.warn('AccessToken expired.');
            destroyCookie(null, 'access_token');
          } else {
            return cookies.access_token;
          }
        }
      }
    }

    if (cookies.refresh_token) {
      const token = cookies.refresh_token.split('.');
      if (token.length === 3) {
        const payload = JSON.parse(Buffer.from(token[1], 'base64').toString());
        if (payload.type && payload.type === 'refresh') {
          if (payload.exp <= now) {
            // expired
            console.warn('RefreshToken expired.');
            destroyCookie(null, 'refresh_token');
          } else {
            const response = await fetch(SERVER_URI + '/auth/refresh', {
              method: 'GET',
              headers: {
                'X-Refresh-Token': cookies.refresh_token,
              },
            });

            if (response.ok) {
              const new_token = await response.json();
              setCookie(null, 'access_token', new_token.access_token);
              return new_token.access_token;
            }
          }
        }
      }
    }
  } catch {
    console.error('An exception has occurred while parsing token.');
    return '';
  }
  return '';
};

export const fetchCurrentUser = async (): Promise<User> => {
  const token = await getAccessToken();
  const response = await fetch(SERVER_URI + '/profile/me', {
    method: 'GET',
    headers: {
      'X-Access-Token': token,
    },
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  return await response.json();
};
