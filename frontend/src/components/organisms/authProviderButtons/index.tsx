import Image from 'next/image';
import Link from 'next/link';
import { SERVER_URI } from '../../../utils/constants';
import { AuthProviderButtonsProps } from './interface';

const AuthProviderButtons: React.FunctionComponent<AuthProviderButtonsProps> = (props) => {
  return (
    <div className='grid'>
      <span className='m-3 grid-rows-1 text-center text-lg'>または次のアカウントで続行</span>
      <div className='m-3 flex grid-rows-1 flex-wrap justify-center'>
        {props.providers.map(v => (
          <div className='m-2 h-12 w-12' key={v.id}><Link href={SERVER_URI + '/auth/oauth2?mode=' + props.mode + '&provider=' + v.name}><a><Image src={'/login/' + v.id + ".png"} width={48} height={48} alt={"Sign-in with " + v.name}/></a></Link></div>
        ))}
      </div>
    </div>
  );
};

export default AuthProviderButtons;
