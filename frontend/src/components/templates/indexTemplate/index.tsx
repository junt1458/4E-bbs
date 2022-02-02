import { useEffect, useState } from 'react';
import { Category } from '../../../types/category';
import { SERVER_URI } from '../../../utils/constants';
import { getAccessToken } from '../../../utils/currentUser';
import CategoryList from '../../organisms/categoryList';

const IndexTemplate: React.FunctionComponent = () => {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(SERVER_URI + '/category/list', {
        method: 'GET',
        headers: {
          'X-Access-Token': await getAccessToken(),
        },
      });

      if (!response.ok) {
        return;
      }

      const data = await response.json();
      setCategories(data as Category[]);
    }
    fetchData();
  }, []);

  return (
    <>
      <h1 className='px-2 py-4 text-center text-3xl'>カテゴリ一覧</h1>
      <CategoryList categories={categories} />
    </>
  );
};

export default IndexTemplate;
