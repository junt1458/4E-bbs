import { Attachment, Post } from '../../../types/post';
import RoundIcon from '../../atoms/roundIcon';
import EditIcon from '@mui/icons-material/Edit';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import VerifiedIcon from '@mui/icons-material/Verified';
import { Tooltip } from '@mui/material';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { getAccessToken } from '../../../utils/currentUser';
import { SERVER_URI } from '../../../utils/constants';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const PostInfo: React.FunctionComponent<{ post: Post; onEditClicked(): void; rnd: number }> = ({
  post,
  onEditClicked,
  rnd,
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

  const handleDownload = async (file: Attachment) => {
    const token = await getAccessToken();
    const link = document.createElement('a');
    link.href = SERVER_URI + '/thread/file?id=' + file.id + '&X-Access-Token=' + token;
    link.download = file.name;
    link.click();
  };

  const toFriendlySize = (size: number): string => {
    const suffix = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
    let divs = 0;
    let value = size;
    while (value / 1024 >= 1) {
      value /= 1024;
      divs++;
    }
    return `${Math.floor(value * 10) / 10} ${suffix[divs]}`;
  };

  return (
    <div className='mx-auto my-2 max-w-3xl p-3'>
      <div className='h-full w-full rounded-lg border-2 border-neutral-400 p-4'>
        <div className='flex items-center'>
          <RoundIcon src={'/api/icon/' + post.user.id + '?rnd=' + rnd} size={48} />
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
        {post.attachments.length == 0 ? (
          <></>
        ) : (
          <div className='m-4 rounded-lg border-2 border-neutral-400 p-2'>
            <div className='m-1 mb-2 text-sm'>添付ファイル</div>
            <div className='flex flex-wrap items-center justify-center'>
              {post.attachments.map((attachment) => (
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    handleDownload(attachment);
                  }}
                  key={attachment.id}
                  href='#'
                >
                  <div
                    className='m-1 flex w-52 flex-wrap border border-neutral-700 p-1'
                    key={attachment.id}
                  >
                    <div className='flex h-10 w-10 items-center justify-center'>
                      <AttachFileIcon />
                    </div>
                    <div className='ml-1 flex flex-1 flex-wrap items-baseline'>
                      <div className='text-sm'>{attachment.name}</div>
                      <div className='text-xs text-gray-500'>
                        ({toFriendlySize(attachment.size)})
                      </div>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostInfo;
