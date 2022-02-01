import LoginTemplate from '../components/templates/loginTemplate';
import { useRequireNotLogin } from '../hooks/useLogin';

export default function Home() {
  useRequireNotLogin();
  return <LoginTemplate />;
}