'use client';
import React, { FC } from 'react';
import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable';

export interface IContentEditableProps {}

const ContentEditable: FC<IContentEditableProps> = () => {
  return (
    <LexicalContentEditable className='ContentEditable__root min-h-40 px-4 py-2 text-sm focus:outline-none' />
  );
};
export default ContentEditable;
