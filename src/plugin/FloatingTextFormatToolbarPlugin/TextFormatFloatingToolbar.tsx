import React from 'react';
import { TOGGLE_LINK_COMMAND } from '@lexical/link';
import { mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';
import { useCallback, useEffect, useRef } from 'react';

import { getDOMRangeRect } from '@/utils/getDOMRangeRect';
import { setFloatingElemPosition } from '@/utils/setFloatingElemPosition';
import {
  MdAddLink,
  MdFormatBold,
  MdFormatItalic,
  MdStrikethroughS,
  MdCode,
  MdFormatUnderlined,
  MdSuperscript,
  MdSubscript,
} from 'react-icons/md';
import {
  ToolbarButton,
  IToolbarButton,
} from '@/components/Toolbar/ToolbarButton';

interface ITextFormatFloatingToolbarProps {
  editor: LexicalEditor;
  anchorElem: HTMLElement;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isLink: boolean;
  isStrikethrough: boolean;
  isSubscript: boolean;
  isSuperscript: boolean;
  isUnderline: boolean;
}

const IS_APPLE = navigator.platform.match(/(Mac|iPhone|iPod|iPad)/i) !== null;
export function TextFormatFloatingToolbar({
  editor,
  anchorElem,
  isLink,
  isBold,
  isItalic,
  isUnderline,
  isCode,
  isStrikethrough,
  isSubscript,
  isSuperscript,
}: ITextFormatFloatingToolbarProps) {
  const popupCharStylesEditorRef = useRef<HTMLDivElement | null>(null);

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, 'https://');
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  function mouseMoveListener(e: MouseEvent) {
    if (
      popupCharStylesEditorRef?.current &&
      (e.buttons === 1 || e.buttons === 3)
    ) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'none') {
        const x = e.clientX;
        const y = e.clientY;
        const elementUnderMouse = document.elementFromPoint(x, y);

        if (!popupCharStylesEditorRef.current.contains(elementUnderMouse)) {
          // Mouse is not over the target element => not a normal click, but probably a drag
          popupCharStylesEditorRef.current.style.pointerEvents = 'none';
        }
      }
    }
  }

  function mouseUpListener() {
    if (popupCharStylesEditorRef?.current) {
      if (popupCharStylesEditorRef.current.style.pointerEvents !== 'auto') {
        popupCharStylesEditorRef.current.style.pointerEvents = 'auto';
      }
    }
  }

  useEffect(() => {
    if (popupCharStylesEditorRef?.current) {
      document.addEventListener('mousemove', mouseMoveListener);
      document.addEventListener('mouseup', mouseUpListener);

      return () => {
        document.removeEventListener('mousemove', mouseMoveListener);
        document.removeEventListener('mouseup', mouseUpListener);
      };
    }
  }, [popupCharStylesEditorRef]);

  const updateTextFormatFloatingToolbar = useCallback(() => {
    const selection = $getSelection();

    const popupCharStylesEditorElem = popupCharStylesEditorRef.current;
    const nativeSelection = window.getSelection();

    if (popupCharStylesEditorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      nativeSelection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const rangeRect = getDOMRangeRect(nativeSelection, rootElement);

      setFloatingElemPosition(
        rangeRect,
        popupCharStylesEditorElem,
        anchorElem,
        isLink
      );
    }
  }, [editor, anchorElem, isLink]);

  useEffect(() => {
    const scrollerElem = anchorElem.parentElement;

    const update = () => {
      editor.getEditorState().read(() => {
        updateTextFormatFloatingToolbar();
      });
    };

    window.addEventListener('resize', update);
    if (scrollerElem) {
      scrollerElem.addEventListener('scroll', update);
    }

    return () => {
      window.removeEventListener('resize', update);
      if (scrollerElem) {
        scrollerElem.removeEventListener('scroll', update);
      }
    };
  }, [editor, updateTextFormatFloatingToolbar, anchorElem]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateTextFormatFloatingToolbar();
    });
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateTextFormatFloatingToolbar();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateTextFormatFloatingToolbar();
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateTextFormatFloatingToolbar]);

  const toolbar1: IToolbarButton[] = [
    {
      label: 'Bold',
      handler: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
      },
      isActive: isBold,
      icon: <MdFormatBold />,
      shortcut: IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)',
    },
    {
      label: 'Italic',
      handler: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
      },
      isActive: isItalic,
      icon: <MdFormatItalic />,
      shortcut: IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)',
    },
    {
      label: 'Strikethrough',
      handler: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
      },
      isActive: isStrikethrough,
      icon: <MdStrikethroughS />,
    },
    {
      label: 'Underline',
      handler: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
      },
      isActive: isUnderline,
      icon: <MdFormatUnderlined />,
      shortcut: IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)',
    },
    {
      label: 'Code',
      handler: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
      },
      isActive: isCode,
      icon: <MdCode />,
      shortcut: IS_APPLE ? 'Code (⌘K)' : 'Code (Ctrl+K)',
    },
    {
      label: 'Inset Link',
      handler: insertLink,
      isActive: isLink,
      icon: <MdAddLink />,
    },
    {
      label: 'Subscript',
      handler: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'subscript');
      },
      isActive: isSubscript,
      icon: <MdSubscript />,
    },
    {
      label: 'Superscript',
      handler: () => {
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'superscript');
      },
      isActive: isSuperscript,
      icon: <MdSuperscript />,
    },
  ];

  return (
    <div
      ref={popupCharStylesEditorRef}
      className='absolute left-0 top-0 z-10 flex items-center gap-2 rounded-lg border bg-white p-2 px-3.5 opacity-0 shadow-md will-change-transform'
    >
      {editor.isEditable() &&
        toolbar1.map((button) => (
          <ToolbarButton
            key={button.label}
            handler={button.handler}
            icon={button.icon}
            label={button.label}
            shortcut={button.shortcut}
            isActive={button.isActive}
          />
        ))}
    </div>
  );
}
