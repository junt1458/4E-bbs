import Divider from '../../atoms/divider';
import AuthProviderButtons from '../../organisms/authProviderButtons';
import LoginForm from '../../organisms/loginForm';

const LoginTemplate: React.FunctionComponent = () => {
  return (
    <div className='flex min-h-screen items-center justify-center overflow-auto'>
      <div className='grid'>
        <h1 className='mb-5 mt-8 grid-rows-1 text-center text-4xl'>Welcome!</h1>
        <h2 className='mb-8 grid-rows-1 text-center text-xl'>
          掲示板にアクセスするにはログインが必要です。
        </h2>
        <LoginForm />
        <Divider width={400} />
        <AuthProviderButtons mode='login' />
      </div>
    </div>
  );
};

export default LoginTemplate;
