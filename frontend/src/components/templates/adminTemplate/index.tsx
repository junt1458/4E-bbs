import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { SERVER_URI } from '../../../utils/constants';
import { getAccessToken } from '../../../utils/currentUser';
import { User } from '../../../types/user';
import { Category } from '../../../types/category';
import { useCurrentUser } from '../../../hooks/useCurrentUser';
import { Label } from '@mui/icons-material';

const AdminTemplate: React.FunctionComponent = () => {
  const { isAuthChecking, currentUser } = useCurrentUser();

  const [registerEnabled, setRegisterEnabled] = useState(false);

  const [open, setOpen] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryDescription, setCategoryDescription] = useState('');
  const [categoryRank, setCategoryRank] = useState(1);

  const [userPage, setUserPage] = React.useState(0);
  const [userRowsPerPage, setUserRowsPerPage] = React.useState(10);
  const [categoryPage, setCategoryPage] = React.useState(0);
  const [categoryRowsPerPage, setCategoryRowsPerPage] = React.useState(10);

  const [users, setUsers] = React.useState<User[]>([]);
  const [categories, setCategories] = React.useState<Category[]>([]);

  const [userFilter, setUserFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const handleUserChange = async (user: User, rank: number) => {
    const postBody = {
      id: user.id,
      rank: rank,
    };

    const response = await fetch(SERVER_URI + '/user/rank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': await getAccessToken(),
      },
      body: JSON.stringify(postBody),
    });

    if (!response.ok) {
      alert('エラーが発生しました。');
      return;
    }

    await fetchUser();
  };

  const handleCategoryChange = async (category: Category, rank: number) => {
    const postBody = {
      id: category.id,
      rank: rank,
    };

    const response = await fetch(SERVER_URI + '/category/rank', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Access-Token': await getAccessToken(),
      },
      body: JSON.stringify(postBody),
    });

    if (!response.ok) {
      alert('エラーが発生しました。');
      return;
    }

    await fetchCategory();
  };

  const filterUsers = (users: User[], val: string): User[] => {
    return users.filter(
      (user) =>
        user.id.indexOf(val) != -1 ||
        user.name.indexOf(val) != -1 ||
        (!user.provider ? '' : user.provider).indexOf(val) != -1,
    );
  };

  const filterCategory = (categories: Category[], val: string): Category[] => {
    return categories.filter(
      (category) => `${category.id}`.indexOf(val) != -1 || category.title.indexOf(val) != -1,
    );
  };

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(SERVER_URI + '/auth/register', {
        method: 'GET',
      });
      const data = await response.json();
      setRegisterEnabled(data.register_open);
    }
    fetchData();
    fetchCategory();
    fetchUser();
  }, [registerEnabled]);

  const fetchCategory = async () => {
    const response = await fetch(SERVER_URI + '/category/list', {
      method: 'GET',
      headers: {
        'X-Access-Token': await getAccessToken(),
      },
    });

    if (!response.ok) {
      alert('エラーが発生しました。');
      return;
    }

    const data = await response.json();
    setCategories(data as Category[]);
  };

  const fetchUser = async () => {
    const response = await fetch(SERVER_URI + '/user/list', {
      method: 'GET',
      headers: {
        'X-Access-Token': await getAccessToken(),
      },
    });

    if (!response.ok) {
      alert('エラーが発生しました。');
      return;
    }

    const data = await response.json();
    setUsers(data as User[]);
  };

  const handleChecked = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const postData = {
      enable: e.target.checked,
    };
    const response = await fetch(SERVER_URI + '/auth/register', {
      method: 'PUT',
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

    setRegisterEnabled(postData.enable);
  };

  const deleteCategory = async (category: Category) => {
    const postData = {
      id: category.id,
    };
    const response = await fetch(SERVER_URI + '/category/remove', {
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

    await fetchCategory();
  };

  const deleteUser = async (user: User) => {
    const postData = {
      id: user.id,
    };
    const response = await fetch(SERVER_URI + '/user/remove', {
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

    await fetchUser();
  };

  const createCategory = async () => {
    if(categoryName == "") {
      alert('未入力項目があります。');
      return;
    }
    const postData = {
      name: categoryName,
      description: categoryDescription,
      rank: categoryRank
    };

    const response = await fetch(SERVER_URI + '/category/add', {
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

    await fetchCategory();
    setCategoryName("");
    setCategoryDescription("");
    setCategoryRank(1);
    setOpen(false);
  };

  const filteredCategory = filterCategory(categories, categoryFilter);
  const filteredUser = filterUsers(users, userFilter);

  // check page range
  if (userPage != 0 && filteredUser.length <= userPage * userRowsPerPage) {
    setCategoryPage(0);
  }

  if (categoryPage != 0 && filteredCategory.length <= categoryPage * categoryRowsPerPage) {
    setCategoryPage(0);
  }

  return (
    <div className='container mx-auto'>
      <h1 className='py-3 text-center text-2xl'>サイト設定の変更</h1>
      <Accordion defaultExpanded={true}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1a-content'
          id='panel1a-header'
        >
          <Typography>サイト設定</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormControlLabel
            control={<Checkbox checked={registerEnabled} onChange={handleChecked} />}
            label='サイトへの新規登録を有効にする'
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2a-content'
          id='panel2a-header'
        >
          <Typography>ユーザー管理</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className='p-4'>
            <TextField
              margin='dense'
              label='検索 (ID/名前/認証方法)'
              type='name'
              fullWidth
              variant='outlined'
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
            />
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>名前</TableCell>
                  <TableCell>認証方法</TableCell>
                  <TableCell>権限</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users != null ? (
                  filteredUser
                    .slice(userPage * userRowsPerPage, userPage * userRowsPerPage + userRowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                          <TableCell id='id'>{row.id}</TableCell>
                          <TableCell id='name'>{row.name}</TableCell>
                          <TableCell id='provider'>{row.provider}</TableCell>
                          <TableCell id='privileges'>
                            <FormControl variant='standard' fullWidth>
                              <Select
                                value={row.rank}
                                onChange={(e) => {
                                  handleUserChange(row, parseInt(e.target.value as string));
                                }}
                                sx={{ paddingLeft: '8px' }}
                                disabled={row.id == (!currentUser ? '' : currentUser.id)}
                              >
                                <MenuItem value={1}>1. 登録ユーザー</MenuItem>
                                <MenuItem value={2}>2. 認証済みユーザー</MenuItem>
                                <MenuItem value={3}>3. サイトモデレーター</MenuItem>
                                <MenuItem value={4}>4. サイト管理者</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell id='action'>
                            <Button
                              variant='contained'
                              color='error'
                              onClick={() => {
                                if (confirm('本当に ' + row.name + ' を削除しますか？')) {
                                  deleteUser(row);
                                }
                              }}
                              disabled={row.id == (!currentUser ? '' : currentUser.id)}
                            >
                              削除
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={filteredUser?.length}
            rowsPerPage={userRowsPerPage}
            page={userPage}
            onPageChange={(e, newPage) => {
              setUserPage(newPage);
            }}
            onRowsPerPageChange={(e) => {
              setUserRowsPerPage(+e.target.value);
              setUserPage(0);
            }}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3a-content'
          id='panel3a-header'
        >
          <Typography>カテゴリ管理</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className='p-4'>
            <Button variant='contained' color='primary' onClick={() => setOpen(true)}>
              新規作成
            </Button>
            <TextField
              margin='dense'
              label='検索 (ID/名前)'
              type='name'
              fullWidth
              variant='outlined'
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
          </div>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align='right'>ID</TableCell>
                  <TableCell>タイトル</TableCell>
                  <TableCell align='right'>スレッド数</TableCell>
                  <TableCell>閲覧権限</TableCell>
                  <TableCell>操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {categories != null ? (
                  filteredCategory
                    .slice(
                      categoryPage * categoryRowsPerPage,
                      categoryPage * categoryRowsPerPage + categoryRowsPerPage,
                    )
                    .map((row) => {
                      return (
                        <TableRow hover role='checkbox' tabIndex={-1} key={row.id}>
                          <TableCell id='id' align='right'>
                            {row.id != -1 ? row.id : ''}
                          </TableCell>
                          <TableCell id='title'>{row.title}</TableCell>
                          <TableCell id='threads' align='right'>
                            {row.threads}
                          </TableCell>
                          <TableCell id='privileges'>
                            <FormControl variant='standard' fullWidth>
                              <Select
                                value={row.rank}
                                onChange={(e) => {
                                  handleCategoryChange(row, parseInt(e.target.value as string));
                                }}
                                sx={{ paddingLeft: '8px' }}
                                disabled={row.id == -1}
                              >
                                <MenuItem value={1}>1. 登録ユーザー</MenuItem>
                                <MenuItem value={2}>2. 認証済みユーザー</MenuItem>
                                <MenuItem value={3}>3. サイトモデレーター</MenuItem>
                                <MenuItem value={4}>4. サイト管理者</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell id='action'>
                            <Button
                              variant='contained'
                              color='error'
                              onClick={() => {
                                if (confirm('本当に ' + row.title + ' を削除しますか？')) {
                                  deleteCategory(row);
                                }
                              }}
                              disabled={row.id == -1}
                            >
                              削除
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })
                ) : (
                  <></>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component='div'
            count={filteredCategory?.length}
            rowsPerPage={categoryRowsPerPage}
            page={categoryPage}
            onPageChange={(e, newPage) => {
              setCategoryPage(newPage);
            }}
            onRowsPerPageChange={(e) => {
              setCategoryRowsPerPage(+e.target.value);
              setCategoryPage(0);
            }}
          />
        </AccordionDetails>
      </Accordion>
      <div className='py-8'></div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>カテゴリの作成</DialogTitle>
        <DialogContent>
          <DialogContentText></DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='thread_title'
            label='カテゴリ名'
            type='text'
            fullWidth
            value={categoryName}
            variant='standard'
            onChange={(e) => setCategoryName(e.target.value)}
          />
          <div className="py-4"></div>
          <TextField
            autoFocus
            margin='dense'
            id='thread_title'
            label='カテゴリ説明'
            type='text'
            fullWidth
            value={categoryDescription}
            variant='standard'
            onChange={(e) => setCategoryDescription(e.target.value)}
          />
          <div className="py-4"></div>
          <FormControl variant='standard' fullWidth>
            <InputLabel id="rank_label">閲覧権限</InputLabel>
            <Select
              labelId='rank_label'
              label="閲覧権限"
              value={categoryRank}
              onChange={(e) => {
                setCategoryRank(parseInt(e.target.value as string));
              }}
              sx={{ paddingLeft: '8px' }}
            >
              <MenuItem value={1}>1. 登録ユーザー</MenuItem>
              <MenuItem value={2}>2. 認証済みユーザー</MenuItem>
              <MenuItem value={3}>3. サイトモデレーター</MenuItem>
              <MenuItem value={4}>4. サイト管理者</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setCategoryName("");
              setCategoryDescription("");
              setCategoryRank(1);
              setOpen(false);
            }}
          >
            キャンセル
          </Button>
          <Button onClick={createCategory}>作成</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AdminTemplate;
