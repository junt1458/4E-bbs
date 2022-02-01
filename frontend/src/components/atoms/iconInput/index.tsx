import { IconInputProps } from './interface';

const IconInput: React.FunctionComponent<IconInputProps> = (props) => {
  return (
    <div
      className='flex h-11 w-screen items-center rounded-lg border-2 border-gray-400 p-1 text-gray-400'
      style={{ maxWidth: props.max_width }}
    >
      {props.icon}
      <input
        type={props.type}
        className='ml-2 h-8 flex-1 text-black'
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        autoComplete={props.autocomplete}
        onKeyDown={(e) => {
          if (e.keyCode == 13 && props.onEnterPressed) props.onEnterPressed();
        }}
      />
    </div>
  );
};

export default IconInput;
