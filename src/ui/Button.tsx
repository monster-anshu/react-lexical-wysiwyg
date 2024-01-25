import React, { FC } from 'react';
import { twMerge } from 'tailwind-merge';
import { CgSpinner } from 'react-icons/cg';

export interface IButtonProps extends React.ComponentProps<'button'> {
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: FC<IButtonProps> = ({
  loading = false,
  children,
  className,
  disabled,
  variant = 'primary',
  onClick,
  size,
  ...props
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  return (
    <button
      type='button'
      {...props}
      disabled={loading || disabled}
      className={twMerge(
        'relative rounded-md border border-transparent px-4 py-2 text-xs font-medium disabled:opacity-80',
        isPrimary && 'bg-blue-500 text-white ',
        isSecondary && 'text-p1 border-p1 bg-slate-300',
        size === 'sm' && 'min-w-[80px]',
        size === 'md' && 'min-w-[110px]',
        size === 'lg' && 'min-w-[145px] ',
        className
      )}
      onClick={onClick}
    >
      {loading ? (
        <>
          <Spinner />
          <div className='invisible'>{children}</div>
        </>
      ) : (
        children
      )}
    </button>
  );
};

const Spinner = () => (
  <div className='absolute left-0 right-0 top-1/2 -translate-y-1/2'>
    <CgSpinner
      size={25}
      className='mx-auto max-h-full max-w-full animate-spin p-1'
    />
  </div>
);
