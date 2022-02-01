import Divider from '../../atoms/divider';
import AuthProviderButtons from '../../organisms/authProviderButtons';
import RegisterForm from '../../organisms/registerForm';

const RegisterTemplate: React.FunctionComponent = () => {
  return (
    <div className='flex min-h-screen items-center justify-center overflow-auto'>
      <div className='grid'>
        <h1 className='mb-5 mt-8 grid-rows-1 text-center text-4xl'>Welcome!</h1>
        <h2 className='mb-8 grid-rows-1 text-center text-xl'>
          新規登録に必要な情報を入力してください。
        </h2>
        <RegisterForm />
        <Divider width={400} />
        <AuthProviderButtons mode='register' />
      </div>
    </div>
  );
};

export default RegisterTemplate;
