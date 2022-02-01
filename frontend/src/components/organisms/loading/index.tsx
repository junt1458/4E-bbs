import Image from 'next/image';

const Loading: React.FunctionComponent = () => {
  return (
    <div>
      <Image src='/loading.gif' alt='Loading Icon' width='200' height='200'></Image>
      <span className='block text-center text-xl'>Loading...</span>
    </div>
  );
};

export default Loading;
