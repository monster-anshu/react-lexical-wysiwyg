import { Select } from '@/ui/Select';
import {
  ElementFormatType,
  LexicalEditor,
  FORMAT_ELEMENT_COMMAND,
  INDENT_CONTENT_COMMAND,
  OUTDENT_CONTENT_COMMAND,
} from 'lexical';

import React, { FC } from 'react';
import { Divider } from './Divider';
import {
  MdFormatAlignLeft,
  MdFormatIndentIncrease,
  MdFormatAlignRight,
  MdFormatAlignCenter,
  MdFormatAlignJustify,
  MdFormatIndentDecrease,
} from 'react-icons/md';

export interface IElementFormatDropdownProps {
  editor: LexicalEditor;
  value: ElementFormatType;
  isRTL: boolean;
  disabled: boolean;
}

export const ElementFormatDropdown: FC<IElementFormatDropdownProps> = ({
  disabled,
  editor,
  isRTL,
  value,
}) => {
  const alignOptions = [
    {
      label: 'Left Align',
      value: 'left',
      icon: <MdFormatAlignLeft />,
      handler: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left'),
    },
    {
      label: 'Right Align',
      value: 'right',
      icon: <MdFormatAlignRight />,
      handler: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right'),
    },
    {
      label: 'Center Align',
      value: 'center',
      icon: <MdFormatAlignCenter />,
      handler: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center'),
    },
    {
      label: 'Justify Align',
      value: 'justify',
      icon: <MdFormatAlignJustify />,
      handler: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify'),
    },
    {
      label: 'Start Align',
      value: 'start',
      icon: isRTL ? <MdFormatAlignRight /> : <MdFormatAlignLeft />,
      handler: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'start'),
    },
    {
      label: 'End Align',
      value: 'end',
      icon: isRTL ? <MdFormatAlignLeft /> : <MdFormatAlignRight />,
      handler: () => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'end'),
    },
  ];

  const indentOption = [
    {
      label: 'Outdent',
      value: 'Outdent',
      icon: isRTL ? <MdFormatIndentIncrease /> : <MdFormatIndentDecrease />,
      handler: () => editor.dispatchCommand(OUTDENT_CONTENT_COMMAND, undefined),
    },
    {
      label: 'Indent',
      value: 'Indent',
      icon: isRTL ? <MdFormatIndentDecrease /> : <MdFormatIndentIncrease />,
      handler: () => editor.dispatchCommand(INDENT_CONTENT_COMMAND, undefined),
    },
  ];

  return (
    <>
      <Select
        options={alignOptions}
        value={value || 'left'}
        onChange={(option) => option.handler()}
        placeholder='Element Format'
        disabled={disabled}
      />
      <Divider />
      <Select
        options={indentOption}
        value={null}
        onChange={(option) => option.handler()}
        placeholder='Indent'
        disabled={disabled}
      />
    </>
  );
};
