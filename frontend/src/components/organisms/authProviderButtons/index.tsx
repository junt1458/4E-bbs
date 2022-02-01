import { AuthProviderButtonsProps } from './interface';

const AuthProviderButtons: React.FunctionComponent<AuthProviderButtonsProps> = (props) => {
  return (
    <div className='grid'>
      <span className='m-3 grid-rows-1 text-center text-lg'>または次のアカウントで続行</span>
      <div className='m-3 flex grid-rows-1 flex-wrap justify-center'>
        <div className='m-2 h-12 w-12 bg-green-500'></div>
        <div className='m-2 h-12 w-12 bg-green-500'></div>
        <div className='m-2 h-12 w-12 bg-green-500'></div>
        <div className='m-2 h-12 w-12 bg-green-500'></div>
        <div className='m-2 h-12 w-12 bg-green-500'></div>
        <div className='m-2 h-12 w-12 bg-green-500'></div>
      </div>
    </div>
  );
};

export default AuthProviderButtons;
