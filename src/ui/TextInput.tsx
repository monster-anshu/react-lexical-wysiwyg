import React, { HTMLInputTypeAttribute } from 'react';

export type ITextInputProps = Readonly<{
  label: string;
  onChange: (val: string) => void;
  placeholder?: string;
  value: string;
  type?: HTMLInputTypeAttribute;
}>;

export function TextInput({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
}: ITextInputProps) {
  return (
    <div className='flex flex-col'>
      <label className='mb-0.5 flex text-xs font-medium text-gray-500'>
        {label}
      </label>
      <input
        type={type}
        className='flex-2 min-w-0 rounded border  px-2 py-1'
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </div>
  );
}
