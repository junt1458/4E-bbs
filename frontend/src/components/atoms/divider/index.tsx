import { DividerProps } from './interface';

const Divider: React.FunctionComponent<DividerProps> = (props) => {
  return (
    <div
      className={
        'mx-auto w-screen border border-gray-300' + (props.className ? props.className : '')
      }
      style={{ maxWidth: props.width }}
    ></div>
  );
};

export default Divider;
