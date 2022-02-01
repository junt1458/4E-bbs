import Image from 'next/image';
import { RoundIconProps } from './interface';

const RoundIcon: React.FunctionComponent<RoundIconProps> = ({ size, src }) => {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: size,
        overflow: 'hidden',
      }}
    >
      <Image layout='fill' objectFit='contain' src={src} alt='My Icon'></Image>
    </div>
  );
};

export default RoundIcon;
