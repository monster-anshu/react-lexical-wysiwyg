import React, { useEffect, useRef, useState } from 'react';
import { LexicalEditor } from 'lexical';
import Button from '@/ui/Button';
import FileInput from '@/ui/FileInput';
import TextInput from '@/ui/TextInput';
import {
  INSERT_INLINE_IMAGE_COMMAND,
  InsertInlineImagePayload,
} from './functions';
import { Position } from '@/nodes/InlineImageNode';

interface InsertInlineImageUploadedDialogBodyProps {
  onClick: (payload: InsertInlineImagePayload) => void;
}

function InsertInlineImageUriDialogBody({
  onClick,
}: InsertInlineImageUploadedDialogBodyProps) {
  const [src, setSrc] = useState('');
  const [altText, setAltText] = useState('');
  const [position, setPosition] = useState<Position>('left');

  const isDisabled = src === '';

  return (
    <>
      <TextInput
        label='InlineImage URL'
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
      <select
        onChange={(e) => setPosition(e.target.value as Position)}
        value={position}
        className='w-full rounded bg-gray-200'
      >
        <option value='left'>Left</option>
        <option value='right'>Right</option>
        <option value='full'>Full Width</option>
      </select>
      <Button
        disabled={isDisabled}
        onClick={() => onClick({ position, src, altText })}
      >
        Confirm
      </Button>
    </>
  );
}

function InsertInlineImageUploadedDialogBody({
  onClick,
}: InsertInlineImageUploadedDialogBodyProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [position, setPosition] = useState<Position>('left');

  const [altText, setAltText] = useState('');
  const isDisabled = !selectedFile;

  const loadInlineImage = (files: FileList | null) => {
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
        position,
        altText,
      });
    }
  };

  return (
    <>
      <FileInput
        label='InlineImage Upload'
        onChange={loadInlineImage}
        accept='image/*'
      />
      <TextInput
        label='Alt Text'
        placeholder='Descriptive alternative text'
        onChange={setAltText}
        value={altText}
      />
      <select
        onChange={(e) => setPosition(e.target.value as Position)}
        value={position}
        className='w-full rounded bg-gray-200'
      >
        <option value='left'>Left</option>
        <option value='right'>Right</option>
        <option value='full'>Full Width</option>
      </select>
      <Button disabled={isDisabled} onClick={handleClick}>
        Confirm
      </Button>
    </>
  );
}

export interface IInsertInlineImageProps {
  activeEditor: LexicalEditor;
  onClose: () => void;
}

export default function InsertInlineImageDialog({
  activeEditor,
  onClose,
}: IInsertInlineImageProps) {
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

  const onClick = ({ position, file, src }: InsertInlineImagePayload) => {
    activeEditor.dispatchCommand(INSERT_INLINE_IMAGE_COMMAND, {
      position,
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
      <>
        {mode === 'url' && <InsertInlineImageUriDialogBody onClick={onClick} />}
        {mode === 'file' && (
          <InsertInlineImageUploadedDialogBody onClick={onClick} />
        )}
      </>
    </div>
  );
}
