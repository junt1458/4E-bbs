import RegisterTemplate from '../components/templates/registerTemplate';
import { useRequireNotLogin } from '../hooks/useLogin';

export default function Home() {
  useRequireNotLogin();
  return <RegisterTemplate />;
}