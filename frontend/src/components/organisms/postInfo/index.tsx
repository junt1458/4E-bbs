import { Post } from '../../../types/post';
import RoundIcon from '../../atoms/roundIcon';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Tooltip } from '@mui/material';
import { useCurrentUser } from '../../../hooks/useCurrentUser';

const PostInfo: React.FunctionComponent<{ post: Post; onEditClicked(): void }> = ({
  post,
  onEditClicked,
}) => {
  const { isAuthChecking, currentUser } = useCurrentUser();
  let posted_at = post.posted_at;
  if (posted_at !== post.updated_at) {
    posted_at += ` (${post.updated_at} 更新)`;
  }

  let badge = <></>;
  let description = '';
  if (post.user.rank == 2) {
    badge = <VerifiedIcon color='success' />;
    description = '認証済みユーザー';
  } else if (post.user.rank == 3) {
    badge = <AdminPanelSettingsIcon color='success' />;
    description = 'モデレータ';
  } else if (post.user.rank == 4) {
    badge = <SupervisorAccountIcon color='error' />;
    description = 'サイト管理者';
  }

  if (isAuthChecking || !currentUser) {
    return <></>;
  }

  return (
    <div className='mx-auto my-2 max-w-3xl p-3'>
      <div className='h-full w-full rounded-lg border-2 border-neutral-400 p-4'>
        <div className='flex items-center'>
          <RoundIcon src='/test.jpg' size={48} />
          <div className='ml-3 flex-1'>
            <div className='text-lg'>
              <Tooltip title={description} arrow>
                {badge}
              </Tooltip>
              {post.user.name}
            </div>
            <div className='flex flex-wrap'>
              <div className='mr-1 text-sm'>{post.posted_at}</div>
              <div className='text-sm'>
                {post.posted_at != post.updated_at ? `(${post.updated_at} 更新)` : ''}
              </div>
            </div>
          </div>
          <div className='w-25 h-25'>
            {currentUser.id === post.user.id || currentUser.rank >= 3 ? (
              <button type='button' className='text-gray-500' onClick={onEditClicked}>
                <EditIcon />
              </button>
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className='mt-3 whitespace-pre-wrap'>{post.content}</div>
      </div>
    </div>
  );
};

export default PostInfo;
