import Head from 'next/head';
import { useRequireNotLogin } from '../hooks/useLogin';

export default function Home() {
  useRequireNotLogin();
  return <div><h1>Login page</h1></div>;
}