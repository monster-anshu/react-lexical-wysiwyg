import React, { useId, useState } from 'react';
import { MdOutlineUpload } from 'react-icons/md';

type IFileInputProps = Readonly<{
  accept?: string;
  label: string;
  onChange: (files: FileList | null) => void;
}>;

export function FileInput({ accept, label, onChange }: IFileInputProps) {
  const id = useId();
  const [selectedFile, setSelectedFile] = useState<FileList | null>(null);
  const fileName = selectedFile?.item(0)?.name;
  const arr = fileName?.split('.') || [];
  const exetenstion = arr.pop();
  const name = arr.join('.');
  const finalName =
    name.slice(0, 40) + (name.length >= 40 ? '...' : '') + '.' + exetenstion;

  return (
    <div className='relative '>
      <label
        htmlFor={id}
        tabIndex={1}
        className='flex w-full cursor-pointer items-center justify-center gap-1 overflow-auto rounded-lg  border border-dotted py-2 text-gray-500'
      >
        {fileName ? (
          <p className='px-3'>{finalName}</p>
        ) : (
          <>
            <MdOutlineUpload size={20} />
            <span>{label}</span>
          </>
        )}
      </label>
      <input
        id={id}
        type='file'
        accept={accept}
        className='sr-only'
        onChange={(e) => {
          onChange(e.target.files);
          setSelectedFile(e.target.files);
        }}
      />
    </div>
  );
}
