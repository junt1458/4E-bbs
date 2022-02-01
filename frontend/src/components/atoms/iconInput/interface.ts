export interface IconInputProps {
  name?: string;
  id?: string;
  placeholder?: string;
  icon: JSX.Element;
  max_width?: number;
  type: string;
  autocomplete?: string;
  onEnterPressed?(): void;
}
