import React, { FC, RefObject } from 'react';
import { ContentEditable as LexicalContentEditable } from '@lexical/react/LexicalContentEditable';

export interface IContentEditableProps {
  onRef?: (ele: HTMLDivElement) => void | RefObject<HTMLDivElement>;
}

export const ContentEditable: FC<IContentEditableProps> = ({ onRef }) => {
  return (
    <div ref={onRef}>
      <LexicalContentEditable className='ContentEditable__root h-48 overflow-auto px-4 py-2 text-sm focus:outline-none' />
    </div>
  );
};
