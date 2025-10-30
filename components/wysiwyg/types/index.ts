export interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
  label?: string;
  helperText?: string;
  maxLength?: number;
  minHeight?: number;
  maxHeight?: number;
  readOnly?: boolean;
  disabled?: boolean;
  toolbar?: 'full' | 'minimal' | 'basic';
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

export interface ToolbarButtonProps {
  onClick: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  title?: string;
}

export interface ToolbarConfig {
  type: 'full' | 'minimal' | 'basic';
  buttons: ToolbarButtonProps[];
}
