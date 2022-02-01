import CategoryList from '../../organisms/categoryList';
import { Category } from '../../organisms/categoryList/interface';

const IndexTemplate: React.FunctionComponent = () => {
  // TODO: できること
  //   1. カテゴリ一覧の表示・遷移

  const categories: Category[] = [
    {
      id: 1,
      title: 'テストカテゴリ1',
      last_post: {
        title: '学校の課題について',
        user_name: 'テスト太郎',
        id: 1,
        date: '2021/01/11 11:11:11',
      },
      threads: 2,
      description: null,
    },
    {
      id: 2,
      title: 'テストカテゴリ2',
      last_post: null,
      threads: 0,
      description: 'テスト用のカテゴリ2です。',
    },
    {
      id: -1,
      title: '(未分類)',
      last_post: {
        title: 'テストメッセージ',
        user_name: '管理者',
        id: 2,
        date: '2021/11/22 22:11:22',
      },
      threads: 5,
      description: 'カテゴリが設定されていないものがここに入ります。',
    },
  ];

  return (
    <>
      <h1 className='px-2 py-4 text-center text-3xl'>カテゴリ一覧</h1>
      <CategoryList categories={categories} />
    </>
  );
};

export default IndexTemplate;
