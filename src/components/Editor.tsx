'use client';
import React, { FC, ReactNode } from 'react';
import ContentEditable from '@/components/ContentEditable';
import Placeholder from '@/components/Placeholder';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';

type OnChangePluginProps = React.ComponentProps<typeof OnChangePlugin>;
export interface IEditorProps {
  onChangePluginProps: OnChangePluginProps;
  placeholder: ReactNode;
  children?: ReactNode;
}

const Editor: FC<IEditorProps> = ({
  onChangePluginProps,
  placeholder,
  children,
}) => {
  return (
    <div className='relative'>
      <RichTextPlugin
        ErrorBoundary={LexicalErrorBoundary}
        contentEditable={<ContentEditable />}
        placeholder={<Placeholder>{placeholder}</Placeholder>}
      />
      <HistoryPlugin />
      <OnChangePlugin {...onChangePluginProps} />
      {children as React.ReactElement}
    </div>
  );
};
export default Editor;
