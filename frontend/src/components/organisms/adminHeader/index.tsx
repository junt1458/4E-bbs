import { AdminHeaderProps } from './interface';
import SettingsIcon from '@mui/icons-material/Settings';
import Link from 'next/link';

const AdminHeader: React.FunctionComponent<AdminHeaderProps> = (props) => {
  if (props.user == null || props.user == undefined) {
    return <></>;
  }

  if (props.user.rank < 4) {
    return <></>;
  }

  return (
    <div className='h-6 w-screen bg-zinc-900 pr-2 text-right text-white'>
      <Link href='/admin'>
        <a>
          <span>
            <SettingsIcon fontSize='small' />
            サイト管理
          </span>
        </a>
      </Link>
    </div>
  );
};

export default AdminHeader;
