'use client';
import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';

export interface IPlaceholderProps extends React.ComponentProps<'div'> {}

const Placeholder: FC<IPlaceholderProps> = ({ className, children }) => {
  return (
    <div
      className={twMerge(
        'pointer-events-none absolute left-5 right-5 top-2 inline-block select-none overflow-hidden text-ellipsis whitespace-nowrap text-gray-500',
        className
      )}
    >
      {children}
    </div>
  );
};
export default Placeholder;
