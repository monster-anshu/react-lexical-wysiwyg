import Editor from '@/components/Editor';
import ToolbarPlugin from '@/components/Toolbar';
import '@/scss/global.scss';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import type { EditorState, LexicalEditor } from 'lexical';
import React, { FC } from 'react';
import theme from '@/theme/EditorTheme';
import Nodes from '@/nodes';
import ImagesPlugin from '@/plugin/ImagePlugin';
import DragDropPaste from '@/plugin/DragDropPastePlugin';
import InlineImagePlugin from '@/plugin/InlineImagePlugin';

export interface IExampleEditorProps {
  onChange: (state: EditorState, editor: LexicalEditor) => void;
}

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ExampleEditor: FC<IExampleEditorProps> = ({ onChange }) => {
  return (
    <div className='relative rounded-lg border'>
      <LexicalComposer
        initialConfig={{
          namespace: 'example',
          theme: theme,
          nodes: Nodes,
          onError() {
            // console.error(error);
          },
        }}
      >
        <ToolbarPlugin />
        <Editor
          onChangePluginProps={{
            onChange,
          }}
          placeholder='Type something...'
        >
          <ImagesPlugin />
          <InlineImagePlugin />
          <DragDropPaste />
        </Editor>
      </LexicalComposer>
    </div>
  );
};
export default ExampleEditor;
