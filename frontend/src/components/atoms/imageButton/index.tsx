import Link from 'next/link';
import Image from 'next/image';
import { ImageButtonProps } from './interface';

const ImageButton: React.FunctionComponent<ImageButtonProps> = ({
  src,
  webPsrc,
  href,
  width,
  height,
  alt,
  onClicked,
}) => {
  const img = (
    <picture>
      {webPsrc != undefined ? <source type='image/webp' srcSet={webPsrc}></source> : null}
      <Image src={src} width={width} height={height} alt={alt} objectFit='contain' />
    </picture>
  );
  return href != undefined ? (
    <Link href={href}>
      <a>{img}</a>
    </Link>
  ) : (
    <button type='button' onClick={onClicked}>
      {img}
    </button>
  );
};

export default ImageButton;
