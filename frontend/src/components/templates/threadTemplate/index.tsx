import {
  Avatar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Pagination,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Category } from '../../../types/category';
import { Post } from '../../../types/post';
import { Thread } from '../../../types/thread';
import { SERVER_URI } from '../../../utils/constants';
import { getAccessToken } from '../../../utils/currentUser';
import ThreadMenu from '../../organisms/threadMenu';
import ThreadForm from '../../organisms/threadForm';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CancelIcon from '@mui/icons-material/Cancel';
import PostInfo from '../../organisms/postInfo';

const ThreadTemplate: React.FunctionComponent = () => {
  // TODO: できること
  //   1. スレッドの表示
  //   2. メッセージの送信
  //   3. メッセージの編集 (自分のもののみ)
  //   4. メッセージの編集・削除(モデレータのみ)
  //   5. ファイルアップロード (認証ユーザーのみ)
  //   6. スレッドの削除(モデレータのみ) → スレッド内メニューに移動
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [order, setOrder] = useState<0 | 1>(0);
  const [thread, setThread] = useState<Thread | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);

  const [currentItem, setCurrentItem] = useState<Post | null>(null);
  const [openSelection, setOpenSelection] = useState(false);
  const [openEdit, setEdit] = useState(false);
  const [openDelete, setDelete] = useState(false);

  const onPressEdit = (post: Post) => {
    setCurrentItem(post);
    setOpenSelection(true);
  };

  const onClickEdit = () => {
    setOpenSelection(false);
    setEdit(true);

    function setCurrentValue() {
      const new_title = document.getElementById('thread_text_new');
      if (!new_title) {
        setTimeout(setCurrentValue, 10);
        return;
      }

      (new_title as HTMLInputElement).value = !currentItem ? '' : currentItem.content;
    }
    setTimeout(setCurrentValue, 10);
  };

  const onClickDelete = () => {
    setOpenSelection(false);
    setDelete(true);
  };

  const onClickUpdate = async () => {
    if (currentItem == null) return;
    const new_title = document.getElementById('thread_text_new');
    if (!new_title) return;
    const new_value = (new_title as HTMLInputElement).value;

    const postData = {
      id: currentItem?.id,
      content: new_value,
    };

    const response = await fetch(SERVER_URI + '/thread/edit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': await getAccessToken(),
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      alert('エラーが発生しました。');
      setEdit(false);
      setCurrentItem(null);
      return;
    }

    await fetchData(currentPage);
    setEdit(false);
    setCurrentItem(null);
  };

  const onClickConfirm = async () => {
    if (currentItem == null) return;

    setDelete(false);
    const postData = {
      id: currentItem?.id,
    };

    const response = await fetch(SERVER_URI + '/thread/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': await getAccessToken(),
      },
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      alert('エラーが発生しました。');
      setDelete(false);
      setCurrentItem(null);
      return;
    }

    await fetchData(currentPage);
    setDelete(false);
    setCurrentItem(null);
  };

  async function fetchData(page: number) {
    const response = await fetch(
      SERVER_URI + '/thread/posts?id=' + router.query.id + '&page=' + page + '&order=' + order,
      {
        method: 'GET',
        headers: {
          'X-Access-Token': await getAccessToken(),
        },
      },
    );

    if (!response.ok) {
      router.replace('/');
      return;
    }

    const data = await response.json();
    setCurrentPage(data.page.current as number);
    setMaxPage(data.page.max as number);
    setPosts(data.posts as Post[]);
    setThread(data.thread as Thread);
    setCategory(data.category as Category);
  }

  useEffect(() => {
    if (router.query == null || router.query.id == null) return;
    let page = 1;
    if (router.query.page != null && !isNaN(parseInt(router.query.page as string))) {
      page = parseInt(router.query.page as string);
    }

    if (router.query.order != null && !isNaN(parseInt(router.query.order as string))) {
      setOrder(parseInt(router.query.order as string) !== 1 ? 0 : 1);
    }
    fetchData(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  if (router.query == null || router.query.id == null) {
    router.replace('/');
    return <></>;
  }

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    if (currentPage != value) {
      router.replace(
        '/thread?id=' +
          router.query.id +
          '&page=' +
          value +
          '&order=' +
          valueOrDefault(router.query.order, 0),
      );
    }
  };

  const valueOrDefault = (val: string | undefined | string[], def: number): number => {
    if (val == undefined || isNaN(parseInt(val as string))) return def;
    return parseInt(val as string);
  };

  const handleOrderChange = (event: SelectChangeEvent) => {
    const val = parseInt(event.target.value);
    router.replace(
      '/thread?id=' +
        router.query.id +
        '&page=' +
        valueOrDefault(router.query.page, 1) +
        '&order=' +
        (val !== 1 ? 0 : 1),
    );
    setOrder(val !== 1 ? 0 : 1);
  };

  const onPosted = async () => {
    await fetchData(currentPage);
  };

  return (
    <>
      <h1 className='px-2 py-4 text-center text-3xl'>{thread?.name}</h1>
      <ThreadMenu thread={thread} />
      <ThreadForm thread={thread} onPosted={onPosted.bind(this)} />

      <div className='mx-auto my-4 w-32 py-4'>
        <FormControl fullWidth>
          <InputLabel id='demo-simple-select-label'>並び替え</InputLabel>
          <Select
            labelId='demo-simple-select-label'
            id='demo-simple-select'
            value={`${order}`}
            label='並び替え'
            onChange={handleOrderChange}
          >
            <MenuItem value={0}>新着順</MenuItem>
            <MenuItem value={1}>投稿順</MenuItem>
          </Select>
        </FormControl>
      </div>
      <Pagination
        className='flex justify-center'
        count={maxPage}
        page={currentPage}
        color='primary'
        onChange={handleChange}
      />
      <div>
        {posts.length == 0 ? (
          <div className='mx-auto my-2 max-w-3xl p-3'>
            <div className='h-full w-full rounded-lg border-2 border-neutral-400 p-4'>
              <div className='m-3 whitespace-pre-wrap text-center text-lg'>
                (まだ投稿はありません。)
              </div>
            </div>
          </div>
        ) : (
          posts.map((p) => <PostInfo key={p.id} post={p} onEditClicked={() => onPressEdit(p)} />)
        )}
      </div>
      <Pagination
        className='flex justify-center'
        count={maxPage}
        page={currentPage}
        color='primary'
        onChange={handleChange}
      />
      <div className='py-5'></div>

      <Dialog
        onClose={() => {
          setCurrentItem(null);
          setOpenSelection(false);
        }}
        open={setCurrentItem != null && openSelection}
      >
        <DialogTitle>操作を選択</DialogTitle>
        <List sx={{ pt: 0 }}>
          <ListItem button onClick={onClickEdit}>
            <ListItemAvatar>
              <Avatar>
                <EditIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='投稿の編集' />
          </ListItem>
          <ListItem button onClick={onClickDelete}>
            <ListItemAvatar>
              <Avatar>
                <DeleteForeverIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='投稿の削除' />
          </ListItem>
          <ListItem
            autoFocus
            button
            onClick={() => {
              setCurrentItem(null);
              setOpenSelection(false);
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <CancelIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary='キャンセル' />
          </ListItem>
        </List>
      </Dialog>

      <Dialog
        open={setCurrentItem != null && openDelete}
        onClose={() => {
          setCurrentItem(null);
          setDelete(false);
        }}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>投稿の削除</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            本当に投稿を削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCurrentItem(null);
              setDelete(false);
            }}
          >
            いいえ
          </Button>
          <Button onClick={onClickConfirm} autoFocus>
            はい
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={setCurrentItem != null && openEdit}
        onClose={() => {
          setCurrentItem(null);
          setEdit(false);
        }}
      >
        <DialogTitle>投稿の編集</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div>内容の編集後、更新ボタンをクリックしてください。</div>
            <TextField
              autoFocus
              margin='dense'
              id='thread_text_new'
              variant='outlined'
              multiline
              rows={5}
              label='内容'
              type='textarea'
              className='h-full w-full'
            />
            <div>※ 添付ファイルの編集はできません。</div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCurrentItem(null);
              setEdit(false);
            }}
          >
            キャンセル
          </Button>
          <Button onClick={onClickUpdate}>更新</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
export default ThreadTemplate;
