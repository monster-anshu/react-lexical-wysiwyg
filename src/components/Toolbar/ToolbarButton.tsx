import React, { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface IToolbarButton {
  icon: ReactNode;
  label: string;
  handler: () => void;
  isActive?: boolean;
  disabled?: boolean;
  shortcut?: string;
  hide?: boolean;
  children?: ReactNode;
}

export interface IToolbarButtonProps extends IToolbarButton {}

const ToolbarButton: FC<IToolbarButtonProps> = ({
  handler,
  icon,
  label,
  shortcut,
  disabled,
  isActive,
  hide,
  children,
}) => {
  if (hide) return null;
  return (
    <div className='relative'>
      <button
        title={shortcut}
        onClick={handler}
        aria-label={label}
        className={twMerge(
          'block text-xl',
          isActive ? 'text-gray-950' : 'text-gray-500',
          disabled ? 'text-gray-400' : ''
        )}
      >
        {icon}
      </button>
      {children}
    </div>
  );
};

export default ToolbarButton;
