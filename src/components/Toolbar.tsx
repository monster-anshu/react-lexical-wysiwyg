import React, { useCallback, useEffect } from 'react';

import {
  $isCodeNode,
  CODE_LANGUAGE_FRIENDLY_NAME_MAP,
  getLanguageFriendlyName,
} from '@lexical/code';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { INSERT_HORIZONTAL_RULE_COMMAND } from '@lexical/react/LexicalHorizontalRuleNode';
import { $patchStyleText } from '@lexical/selection';

import {
  $INTERNAL_isPointSelection,
  $getNodeByKey,
  $getSelection,
  COMMAND_PRIORITY_NORMAL,
  FORMAT_TEXT_COMMAND,
  KEY_MODIFIER_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
} from 'lexical';

import {
  MdAddLink,
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdStrikethroughS,
  MdSuperscript,
  MdSubscript,
  MdFormatOverline,
  MdOutlineTurnLeft,
  MdOutlineTurnRight,
  MdCode,
} from 'react-icons/md';

const IS_APPLE = false;

import Select from '@/ui/Select';
import { sanitizeUrl } from '@/utils/url';
import { BLOCK_TYPES } from '@/common';
import ToolbarButton, { IToolbarButton } from './ToolbarButton';
import FontDropDown from './FontDropDown';
import Divider from './Divider';
import ElementFormatDropdown from './ElementFormatDropdown';
import BlockFormatDropDown from './BlockFormatDropDown';
import { $clearFormatting } from '@/functions/clearFormatting';
import { useFormat } from '@/hooks/useFormat';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

function getCodeLanguageOptions(): [string, string][] {
  const options: [string, string][] = [];

  for (const [lang, friendlyName] of Object.entries(
    CODE_LANGUAGE_FRIENDLY_NAME_MAP
  )) {
    options.push([lang, friendlyName]);
  }

  return options;
}

const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();

export default function ToolbarPlugin({}) {
  const [editor] = useLexicalComposerContext();
  const {
    activeEditor,
    blockType,
    canRedo,
    canUndo,
    codeLanguage,
    elementFormat,
    fontFamily,
    fontSize,
    isBold,
    isCode,
    isEditable,
    isItalic,
    isLink,
    isRTL,
    isStrikethrough,
    isSubscript,
    isSuperscript,
    isUnderline,
    rootType,
    selectedElementKey,
  } = useFormat();

  useEffect(() => {
    return activeEditor.registerCommand(
      KEY_MODIFIER_COMMAND,
      (payload) => {
        const event: KeyboardEvent = payload;
        const { code, ctrlKey, metaKey } = event;

        if (code === 'KeyK' && (ctrlKey || metaKey)) {
          event.preventDefault();
          let url: string | null;
          if (!isLink) {
            // setIsLinkEditMode(true);
            url = sanitizeUrl('https://');
          } else {
            // setIsLinkEditMode(false);
            url = null;
          }
          return activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, url);
        }
        return false;
      },
      COMMAND_PRIORITY_NORMAL
    );
  }, [activeEditor, isLink]);

  const applyStyleText = useCallback(
    (styles: Record<string, string>, skipHistoryStack?: boolean) => {
      activeEditor.update(
        () => {
          const selection = $getSelection();
          if ($INTERNAL_isPointSelection(selection)) {
            $patchStyleText(selection, styles);
          }
        },
        skipHistoryStack ? { tag: 'historic' } : {}
      );
    },
    [activeEditor]
  );

  const clearFormatting = useCallback(() => {
    activeEditor.update(() => {
      $clearFormatting();
    });
  }, [activeEditor]);

  // TODO - implement
  // const onFontColorSelect =
  useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ color: value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  // TODO - implement
  // const onBgColorSelect =
  useCallback(
    (value: string, skipHistoryStack: boolean) => {
      applyStyleText({ 'background-color': value }, skipHistoryStack);
    },
    [applyStyleText]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      activeEditor.dispatchCommand(
        TOGGLE_LINK_COMMAND,
        sanitizeUrl('https://')
      );
    } else {
      activeEditor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [activeEditor, isLink]);

  const onCodeLanguageSelect = useCallback(
    (value: string) => {
      activeEditor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(value);
          }
        }
      });
    },
    [activeEditor, selectedElementKey]
  );

  const toolbar2: IToolbarButton[] = [
    {
      label: 'Undo',
      icon: <MdOutlineTurnLeft />,
      handler: () => activeEditor.dispatchCommand(UNDO_COMMAND, undefined),
      shortcut: IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)',
      disabled: !canUndo,
    },
    {
      label: 'Redo',
      icon: <MdOutlineTurnRight />,
      handler: () => activeEditor.dispatchCommand(REDO_COMMAND, undefined),
      shortcut: IS_APPLE ? 'Redo (⌘Y)' : 'Redo (Ctrl+Y)',
      disabled: !canRedo,
    },
  ];

  const codeLanguageOptions = CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
    return {
      label: name,
      value: value,
      handler: () => onCodeLanguageSelect(value),
      isActive: value === codeLanguage,
      disabled: !isEditable,
      name: getLanguageFriendlyName(codeLanguage),
    };
  });

  const toolbar1: IToolbarButton[] = [
    {
      label: 'Bold',
      handler: () => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      },
      isActive: isBold,
      icon: <MdFormatBold />,
      shortcut: IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)',
    },
    {
      label: 'Italic',
      handler: () => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      },
      isActive: isItalic,
      icon: <MdFormatItalic />,
      shortcut: IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)',
    },
    {
      label: 'Strikethrough',
      handler: () => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      },
      isActive: isStrikethrough,
      icon: <MdStrikethroughS />,
    },
    {
      label: 'Underline',
      handler: () => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      },
      isActive: isUnderline,
      icon: <MdFormatUnderlined />,
      shortcut: IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)',
      hide: true,
    },
    {
      label: 'Code',
      handler: () => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      },
      isActive: isCode,
      icon: <MdCode />,
      shortcut: IS_APPLE ? 'Code (⌘K)' : 'Code (Ctrl+K)',
      hide: true,
    },
    {
      label: 'Inset Link',
      handler: insertLink,
      isActive: isLink,
      icon: <MdAddLink />,
      hide: true,
    },
  ];

  const formattingOptions = [
    {
      label: 'Subscript',
      value: 'subscript',
      handler: () => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
      },
      isActive: isSubscript,
      icon: <MdSubscript />,
    },
    {
      label: 'Superscript',
      value: 'superscript',
      handler: () => {
        activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
      },
      isActive: isSuperscript,
      icon: <MdSuperscript />,
    },
    {
      label: 'Clear Formatting',
      value: 'clear',
      handler: clearFormatting,
      icon: <MdFormatOverline />,
    },
  ];

  const interOptions = [
    {
      label: 'Horizontal Rule',
      value: 'horizontal-rule',
      handler: () => {
        activeEditor.dispatchCommand(INSERT_HORIZONTAL_RULE_COMMAND, undefined);
      },
    },
  ];

  return (
    <div className='flex items-center gap-4 overflow-auto whitespace-nowrap rounded-t-lg border-b bg-white px-5 py-3 text-sm'>
      {toolbar1.map((item, index) => {
        return <ToolbarButton {...item} key={index} />;
      })}
      <Divider />
      {blockType in BLOCK_TYPES && activeEditor === editor && (
        <>
          <BlockFormatDropDown
            disabled={!isEditable}
            blockType={blockType}
            editor={activeEditor}
          />
          <Divider />
        </>
      )}
      {blockType === 'code' ? (
        <Select
          options={codeLanguageOptions}
          onChange={(option) => option.handler()}
          placeholder='Select language'
          value={codeLanguage}
        />
      ) : (
        <>
          <FontDropDown
            disabled={!isEditable}
            style={'font-family'}
            value={fontFamily}
            editor={activeEditor}
          />
          <FontDropDown
            disabled={!isEditable}
            style={'font-size'}
            value={fontSize}
            editor={activeEditor}
          />
          <Divider />
          {toolbar2.map((item, index) => {
            return <ToolbarButton {...item} key={index} />;
          })}
          <Select
            options={formattingOptions}
            onChange={(option) => option.handler()}
            placeholder='Formatting options'
            value={null}
          />
          <Divider />
          {rootType === 'table' && (
            <>
              {/* TODO */}
              <Divider />
            </>
          )}
          <Select
            options={interOptions}
            onChange={(option) => option.handler()}
            value={null}
            placeholder='Insert'
          />
        </>
      )}
      <Divider />
      <ElementFormatDropdown
        disabled={!isEditable}
        value={elementFormat}
        editor={activeEditor}
        isRTL={isRTL}
      />
    </div>
  );
}
