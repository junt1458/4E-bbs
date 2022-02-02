import Link from 'next/link';
import { CategoryListProps } from './interface';

const CategoryList: React.FunctionComponent<CategoryListProps> = (props) => {
  return (
    <div className='m-4 rounded-md border border-slate-500'>
      {props.categories.map((v) => (
        <div key={v.id} className='relative flex flex-wrap rounded-sm border border-slate-600 p-3'>
          <div className='flex flex-1 items-center py-3'>
            <span>
              {v.title} <span className='text-xs'>(スレッド数: {v.threads})</span>
              <br />
              <span className='mt-2 text-gray-600'>{v.description}</span>
            </span>
          </div>
          <div className='max-w-64 w-64 overflow-clip py-3 text-sm'>
            <span>最後の投稿: {v.last_post == null ? '(なし)' : ''}</span>
            <span className='block w-60 overflow-hidden overflow-ellipsis whitespace-nowrap'>
              {v.last_post == null ? <>&nbsp;</> : v.last_post.title}
            </span>
            <span className='block w-60 overflow-hidden overflow-ellipsis whitespace-nowrap'>
              {v.last_post == null ? <>&nbsp;</> : '更新日時: ' + v.last_post.date}
            </span>
            <span className='block w-60 overflow-hidden overflow-ellipsis whitespace-nowrap'>
              {v.last_post == null ? <>&nbsp;</> : '投稿者: ' + v.last_post.user_name}
            </span>
          </div>
          <Link href={'/threads?id=' + v.id}>
            <a className='absolute top-0 left-0 block h-full w-full'></a>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default CategoryList;
