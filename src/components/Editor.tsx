'use client';
import React, { ComponentProps, FC } from 'react';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

export interface IEditorProps extends ComponentProps<typeof RichTextPlugin> {}

const Editor: FC<IEditorProps> = ({ ...props }) => {
  return (
    <div className=''>
      <RichTextPlugin {...props} />
    </div>
  );
};

export default Editor;
