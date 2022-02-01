export interface ImageButtonProps {
  src: string;
  webPsrc?: string;
  width: number;
  height: number;
  href?: string;
  alt: string;
  onClicked?(): void;
}
