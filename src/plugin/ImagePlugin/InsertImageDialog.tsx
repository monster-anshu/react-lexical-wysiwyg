import React, { useEffect, useRef, useState } from 'react';
import { LexicalEditor } from 'lexical';
import Button from '@/ui/Button';
import FileInput from '@/ui/FileInput';
import TextInput from '@/ui/TextInput';
import { INSERT_IMAGE_COMMAND, InsertImagePayload } from './functions';

interface InsertImageUploadedDialogBodyProps {
  onClick: (payload: InsertImagePayload) => void;
}

function InsertImageUriDialogBody({
  onClick,
}: InsertImageUploadedDialogBodyProps) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');

  const isDisabled = src === '';

  return (
    <>
      <TextInput
        label='Image URL'
        placeholder='i.e. https://source.unsplash.com/random'
        onChange={setSrc}
        value={src}
      />
      <TextInput
        label='Alt Text'
        placeholder='Random unsplash image'
        onChange={setAltText}
        value={altText}
      />
      <Button disabled={isDisabled} onClick={() => onClick({ altText, src })}>
        Confirm
      </Button>
    </>
  );
}

function InsertImageUploadedDialogBody({
  onClick,
}: InsertImageUploadedDialogBodyProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [altText, setAltText] = useState('');
  const isDisabled = !selectedFile;

  const loadImage = (files: FileList | null) => {
    const file = files?.item(0);
    if (file) {
      setSelectedFile(file);
      setAltText(file.name);
    }
  };

  const handleClick = () => {
    if (selectedFile) {
      onClick({
        file: selectedFile,
        altText,
      });
    }
  };

  return (
    <>
      <FileInput label='Image Upload' onChange={loadImage} accept='image/*' />
      <TextInput
        label='Alt Text'
        placeholder='Descriptive alternative text'
        onChange={setAltText}
        value={altText}
      />
      <Button disabled={isDisabled} onClick={handleClick}>
        Confirm
      </Button>
    </>
  );
}

export interface IInsertImageProps {
  activeEditor: LexicalEditor;
  onClose: () => void;
}

export default function InsertImageDialog({
  activeEditor,
  onClose,
}: IInsertImageProps) {
  const [mode, setMode] = useState<null | 'url' | 'file'>(null);
  const hasModifier = useRef(false);

  useEffect(() => {
    hasModifier.current = false;
    const handler = (e: KeyboardEvent) => {
      hasModifier.current = e.altKey;
    };
    document.addEventListener('keydown', handler);
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }, [activeEditor]);

  const onClick = ({ altText, file, src }: InsertImagePayload) => {
    activeEditor.dispatchCommand(INSERT_IMAGE_COMMAND, {
      altText,
      file,
      src,
    });
    onClose();
  };

  return (
    <div className='space-y-2'>
      {!mode && (
        <>
          <Button onClick={() => setMode('url')} className='w-full'>
            URL
          </Button>
          <Button onClick={() => setMode('file')} className='w-full'>
            File
          </Button>
        </>
      )}
      {mode === 'url' && <InsertImageUriDialogBody onClick={onClick} />}
      {mode === 'file' && <InsertImageUploadedDialogBody onClick={onClick} />}
    </div>
  );
}
