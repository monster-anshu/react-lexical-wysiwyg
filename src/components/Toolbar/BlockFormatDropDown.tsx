import React, { FC } from 'react';
import { $setBlocksType } from '@lexical/selection';
import {
  $INTERNAL_isPointSelection,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  LexicalEditor,
} from 'lexical';
import {
  $createHeadingNode,
  $createQuoteNode,
  HeadingTagType,
} from '@lexical/rich-text';
import {
  INSERT_CHECK_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from '@lexical/list';
import { $createCodeNode } from '@lexical/code';

import { BsTextParagraph } from 'react-icons/bs';
import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuHeading4,
  LuHeading5,
} from 'react-icons/lu';
import {
  MdCode,
  MdOutlineFormatListBulleted,
  MdFormatListNumbered,
  MdOutlineChecklistRtl,
  MdFormatQuote,
} from 'react-icons/md';

import Select from '@/ui/Select';
import { BlockType } from '@/common';

export interface IBlockFormatProps {
  blockType: BlockType;
  editor: LexicalEditor;
  disabled?: boolean;
}

const BlockFormatDropDown: FC<IBlockFormatProps> = ({
  editor,
  blockType,
  disabled = false,
}) => {
  const formatParagraph = () => {
    editor.update(() => {
      const selection = $getSelection();
      if ($INTERNAL_isPointSelection(selection)) {
        $setBlocksType(selection, () => $createParagraphNode());
      }
    });
  };

  const formatHeading = (headingSize: HeadingTagType) => {
    if (blockType !== headingSize) {
      editor.update(() => {
        const selection = $getSelection();
        if ($INTERNAL_isPointSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(headingSize));
        }
      });
    }
  };

  const formatBulletList = () => {
    if (blockType !== 'bullet') {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatCheckList = () => {
    if (blockType !== 'check') {
      editor.dispatchCommand(INSERT_CHECK_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatNumberedList = () => {
    if (blockType !== 'number') {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    }
  };

  const formatQuote = () => {
    if (blockType !== 'quote') {
      editor.update(() => {
        const selection = $getSelection();
        if ($INTERNAL_isPointSelection(selection)) {
          $setBlocksType(selection, () => $createQuoteNode());
        }
      });
    }
  };

  const formatCode = () => {
    if (blockType !== 'code') {
      editor.update(() => {
        let selection = $getSelection();

        if ($INTERNAL_isPointSelection(selection)) {
          if (selection.isCollapsed()) {
            $setBlocksType(selection, () => $createCodeNode());
          } else {
            const textContent = selection.getTextContent();
            const codeNode = $createCodeNode();
            selection.insertNodes([codeNode]);
            selection = $getSelection();
            if ($isRangeSelection(selection))
              selection.insertRawText(textContent);
          }
        }
      });
    }
  };

  const options = [
    {
      icon: <BsTextParagraph />,
      label: 'Normal',
      handler: formatParagraph,
      value: 'paragraph',
    },
    {
      icon: <LuHeading1 />,
      label: 'Heading 1',
      handler: () => formatHeading('h1'),
      value: 'h1',
    },
    {
      icon: <LuHeading2 />,
      label: 'Heading 2',
      handler: () => formatHeading('h2'),
      value: 'h2',
    },
    {
      icon: <LuHeading3 />,
      label: 'Heading 3',
      handler: () => formatHeading('h3'),
      value: 'h3',
    },
    {
      icon: <LuHeading4 />,
      label: 'Heading 4',
      handler: () => formatHeading('h4'),
      value: 'h4',
    },
    {
      icon: <LuHeading5 />,
      label: 'Heading 5',
      handler: () => formatHeading('h5'),
      value: 'h5',
    },
    {
      icon: <MdOutlineFormatListBulleted />,
      label: 'Bullet List',
      handler: formatBulletList,
      value: 'bullet',
    },
    {
      icon: <MdFormatListNumbered />,
      label: 'Numbered List',
      handler: formatNumberedList,
      value: 'number',
    },
    {
      icon: <MdOutlineChecklistRtl />,
      label: 'Check List',
      handler: formatCheckList,
      value: 'check',
    },
    {
      icon: <MdFormatQuote />,
      label: 'Quote',
      handler: formatQuote,
      value: 'quote',
    },
    {
      icon: <MdCode />,
      label: 'Code Block',
      handler: formatCode,
      value: 'code',
    },
  ];
  return (
    <Select
      options={options}
      value={blockType}
      onChange={(option) => option.handler()}
      placeholder='Block Format'
      disabled={disabled}
    />
  );
};

export default BlockFormatDropDown;
