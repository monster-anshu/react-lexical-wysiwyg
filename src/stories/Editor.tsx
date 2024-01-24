import Editor from '@/components/Editor';
import ToolbarPlugin from '@/components/Toolbar';
import '../index.scss';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import type { EditorState, LexicalEditor } from 'lexical';
import React, { FC, useState } from 'react';
import theme from '@/theme/EditorTheme';
import Nodes from '@/nodes';

import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin';

import ImagesPlugin from '@/plugin/ImagePlugin';
import DragDropPaste from '@/plugin/DragDropPastePlugin';
import InlineImagePlugin from '@/plugin/InlineImagePlugin';
import FloatingLinkEditorPlugin from '@/plugin/FloatingLinkEditorPlugin';
import LinkPlugin from '@/plugin/LinkPlugin';
import { prepopulatedRichText } from './test';
import FloatingTextFormatToolbarPlugin from '@/plugin/FloatingTextFormatToolbarPlugin';
import { $generateHtmlFromNodes } from '@lexical/html';
import Renderer from '@/components/Renderer';

export interface IExampleEditorProps {
  onChange: (state: EditorState, editor: LexicalEditor) => void;
}

// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const ExampleEditor: FC<IExampleEditorProps> = ({ onChange }) => {
  const [text, settext] = useState('');
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null);

  const onRef = (div: HTMLDivElement) => {
    if (div !== null) {
      setFloatingAnchorElem(div);
    }
  };

  return (
    <>
      <div className='relative rounded-lg border'>
        <LexicalComposer
          initialConfig={{
            namespace: 'example',
            theme: theme,
            nodes: Nodes,
            onError() {
              // console.error(error);
            },
            editorState() {
              prepopulatedRichText();
            },
          }}
        >
          <ToolbarPlugin />
          <Editor
            onChangePluginProps={{
              onChange: (state, editor) => {
                state.read(() => {
                  const htmlString = $generateHtmlFromNodes(editor);
                  settext(htmlString);
                  onChange(state, editor);
                });
              },
            }}
            contentEditableProps={{
              onRef,
            }}
            placeholder='Type something...'
          >
            <ImagesPlugin />
            <InlineImagePlugin />
            <DragDropPaste />
            <LinkPlugin />
            <FloatingLinkEditorPlugin
              anchorElem={floatingAnchorElem || undefined}
            />
            <FloatingTextFormatToolbarPlugin />
            <ListPlugin />
            <CheckListPlugin />
          </Editor>
        </LexicalComposer>
      </div>
      <Renderer>{text}</Renderer>
    </>
  );
};
export default ExampleEditor;
