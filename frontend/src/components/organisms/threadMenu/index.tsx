import { useCurrentUser } from '../../../hooks/useCurrentUser';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import CategoryIcon from '@mui/icons-material/Category';
import { Thread } from '../../../types/thread';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { SERVER_URI } from '../../../utils/constants';
import { getAccessToken } from '../../../utils/currentUser';
import { Category } from '../../../types/category';

const ThreadMenu: React.FunctionComponent<{ thread: Thread | null; category: Category | null }> = ({
  thread,
  category,
}) => {
  const router = useRouter();
  const { isAuthChecking, currentUser } = useCurrentUser();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editCategoryOpen, setCategoryOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (isAuthChecking || !currentUser || !thread || currentUser?.rank < 3) {
    return <></>;
  }

  const onClickEdit = async () => {
    const new_title = document.getElementById('thread_title_new');
    if (!new_title) return;

    const title_new = (new_title as HTMLInputElement).value;
    const postData = {
      thread_id: !thread ? '' : thread.id,
      name: title_new,
    };
    const response = await fetch(SERVER_URI + '/thread/rename', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': await getAccessToken(),
      },
      body: JSON.stringify(postData),
    });
    if (!response.ok) {
      alert('エラーが発生しました。');
      return;
    }
    router.reload();
    setEditDialogOpen(false);
  };

  const onClickEditOpen = () => {
    setEditDialogOpen(true);

    function setCurrentValue() {
      const new_title = document.getElementById('thread_title_new');
      if (!new_title) {
        setTimeout(setCurrentValue, 10);
        return;
      }

      (new_title as HTMLInputElement).value = !thread ? '' : thread.name;
    }
    setTimeout(setCurrentValue, 10);
  };

  const onDeleteConfirm = async () => {
    const postData = {
      thread_id: !thread ? '' : thread.id,
    };
    const response = await fetch(SERVER_URI + '/thread/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': await getAccessToken(),
      },
      body: JSON.stringify(postData),
    });
    setDeleteDialogOpen(false);
    if (!response.ok) {
      alert('エラーが発生しました。');
      return;
    }
    router.push('/');
  };

  const handleOpenEditCategory = async () => {
    if (category == null) return;
    setCategoryOpen(true);
    const response = await fetch(SERVER_URI + '/category/list', {
      method: 'GET',
      headers: {
        'X-Access-Token': await getAccessToken(),
      },
    });

    if (!response.ok) {
      alert('エラーが発生しました。');
      setCategoryOpen(false);
      return;
    }

    const data = await response.json();
    setCategories(data as Category[]);
    for (let i = 0; i < (data as Category[]).length; i++) {
      const cat: Category = data[i];
      if (cat.id === category.id) {
        setSelectedIndex(i);
        return;
      }
    }
    setSelectedIndex(0);
  };

  const onClickApply = async () => {
    const category_new = categories[selectedIndex];

    const postData = {
      id: thread.id,
      category: category_new.id,
    };

    const response = await fetch(SERVER_URI + '/thread/category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': await getAccessToken(),
      },
      body: JSON.stringify(postData),
    });

    console.log(await response.json());

    if (!response.ok) {
      alert('エラーが発生しました。');
      setCategoryOpen(false);
      return;
    }

    setCategoryOpen(false);
    router.reload();
  };

  return (
    <div>
      <div className='mt-3 grid'>
        <div className='mx-auto grid-rows-1'>
          <span>スレッドの管理</span>
        </div>
        <div className='grid-rows-1'>
          <div className='m-3 flex grid-rows-1 flex-wrap justify-center'>
            <div className='m-2 h-12'>
              <Button color='primary' variant='contained' onClick={onClickEditOpen}>
                <EditIcon />
                タイトル編集
              </Button>
            </div>
            <div className='m-2 h-12'>
              <Button color='error' variant='contained' onClick={() => setDeleteDialogOpen(true)}>
                <DeleteForeverIcon />
                スレッド削除
              </Button>
            </div>
            <div className='m-2 h-12'>
              <Button color='secondary' variant='contained' onClick={handleOpenEditCategory}>
                <CategoryIcon />
                カテゴリ変更
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>スレッドタイトルの編集</DialogTitle>
        <DialogContent>
          <DialogContentText>新しいスレッドのタイトルを入力してください。</DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='thread_title_new'
            label='スレッドタイトル'
            type='name'
            fullWidth
            variant='standard'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>キャンセル</Button>
          <Button onClick={onClickEdit}>更新</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby='alert-dialog-title'
        aria-describedby='alert-dialog-description'
      >
        <DialogTitle id='alert-dialog-title'>スレッドの削除</DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            このスレッドを削除しますか？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>いいえ</Button>
          <Button onClick={onDeleteConfirm} autoFocus>
            はい
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={editCategoryOpen} onClose={() => setCategoryOpen(false)}>
        <DialogTitle>スレッドカテゴリの編集</DialogTitle>
        <DialogContent>
          <DialogContentText>新しいスレッドのカテゴリを選択してください。</DialogContentText>
          <div className='py-2'></div>
          <FormControl fullWidth>
            <InputLabel id='select_label'>カテゴリ</InputLabel>
            <Select
              labelId='select_label'
              id='thread_category_id'
              value={selectedIndex}
              label='カテゴリ'
              onChange={(e) => setSelectedIndex(parseInt(e.target.value as string))}
              autoFocus
            >
              {categories.map((v, index) => (
                <MenuItem key={index} value={index}>
                  {v.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCategoryOpen(false)}>キャンセル</Button>
          <Button onClick={onClickApply}>更新</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ThreadMenu;
