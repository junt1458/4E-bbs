import Loading from '../../organisms/loading';

const LoadingTemplate: React.FunctionComponent = () => {
  return (
    <div className='flex h-screen min-h-screen items-center justify-center overflow-auto'>
      <Loading />
    </div>
  );
};

export default LoadingTemplate;
