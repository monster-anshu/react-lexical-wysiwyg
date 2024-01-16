'use client';
import Editor from '@/components/Editor';
import ToolbarPlugin from '@/components/Toolbar';
import '@/scss/global.scss';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import type { EditorState, LexicalEditor } from 'lexical';
import React, { FC } from 'react';

export interface IExampleEditorProps {
  onChange: (state: EditorState, editor: LexicalEditor) => void;
}

const ExampleEditor: FC<IExampleEditorProps> = ({ onChange }) => {
  return (
    <div className='relative rounded-lg border'>
      <LexicalComposer
        initialConfig={{
          namespace: 'example',
          onError(error) {
            console.error(error);
          },
        }}
      >
        <ToolbarPlugin />
        <Editor
          onChangePluginProps={{
            onChange,
          }}
          placeholder='Type something...'
        />
      </LexicalComposer>
    </div>
  );
};
export default ExampleEditor;
