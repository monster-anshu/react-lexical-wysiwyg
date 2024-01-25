import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export interface IPlaceholderProps extends React.ComponentProps<'div'> {}

export const Placeholder: FC<IPlaceholderProps> = ({
  className,
  children,
  ...props
}) => {
  return (
    <div
      {...props}
      className={twMerge(
        'pointer-events-none absolute inset-4 top-2 inline-block select-none overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-500',
        className
      )}
    >
      {children}
    </div>
  );
};
