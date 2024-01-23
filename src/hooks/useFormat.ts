import { useCallback, useEffect, useState } from 'react';
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  ElementFormatType,
  NodeKey,
  SELECTION_CHANGE_COMMAND,
  $isRootOrShadowRoot,
  $isTextNode,
  $isParagraphNode,
} from 'lexical';

import { getSelectedNode } from '@/utils/getSelectedNode';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';

import {
  $findMatchingParent,
  $getNearestNodeOfType,
  mergeRegister,
} from '@lexical/utils';

import {
  $getSelectionStyleValueForProperty,
  $isParentElementRTL,
} from '@lexical/selection';

import { $isHeadingNode } from '@lexical/rich-text';

import { $isLinkNode } from '@lexical/link';

import { $isTableNode } from '@lexical/table';

import { $isListNode, ListNode } from '@lexical/list';

import {
  $isCodeNode,
  CODE_LANGUAGE_MAP,
  $isCodeHighlightNode,
} from '@lexical/code';

import { BLOCK_TYPES, BlockType, RootType } from '@/common';

export function useFormat() {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [blockType, setBlockType] = useState<BlockType>('paragraph');
  const [rootType, setRootType] = useState<RootType>('root');
  const [selectedElementKey, setSelectedElementKey] = useState<NodeKey | null>(
    null
  );
  const [fontSize, setFontSize] = useState<string>('15px');
  const [fontColor, setFontColor] = useState<string>('#000');
  const [bgColor, setBgColor] = useState<string>('#fff');
  const [fontFamily, setFontFamily] = useState<string>('Arial');
  const [elementFormat, setElementFormat] = useState<ElementFormatType>('left');
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isSubscript, setIsSubscript] = useState(false);
  const [isSuperscript, setIsSuperscript] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isRTL, setIsRTL] = useState(false);
  const [codeLanguage, setCodeLanguage] = useState<string>('');
  const [isEditable, setIsEditable] = useState(() => editor.isEditable());
  const [isText, setIsText] = useState(false);

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : $findMatchingParent(anchorNode, (e) => {
              const parent = e.getParent();
              return parent !== null && $isRootOrShadowRoot(parent);
            });

      if (element === null) {
        element = anchorNode.getTopLevelElementOrThrow();
      }

      const elementKey = element.getKey();
      const elementDOM = activeEditor.getElementByKey(elementKey);

      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsSubscript(selection.hasFormat('subscript'));
      setIsSuperscript(selection.hasFormat('superscript'));
      setIsCode(selection.hasFormat('code'));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }

      const tableNode = $findMatchingParent(node, $isTableNode);
      if ($isTableNode(tableNode)) {
        setRootType('table');
      } else {
        setRootType('root');
      }

      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode
          );
          const type = parentList
            ? parentList.getListType()
            : element.getListType();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          if (type in BLOCK_TYPES) {
            setBlockType(type as BlockType);
          }
          if ($isCodeNode(element)) {
            const language =
              element.getLanguage() as keyof typeof CODE_LANGUAGE_MAP;
            setCodeLanguage(
              language ? CODE_LANGUAGE_MAP[language] || language : ''
            );
            return;
          }
        }
      }
      // Handle buttons
      setFontSize(
        $getSelectionStyleValueForProperty(selection, 'font-size', '15px')
      );
      setFontColor(
        $getSelectionStyleValueForProperty(selection, 'color', '#000')
      );
      setBgColor(
        $getSelectionStyleValueForProperty(
          selection,
          'background-color',
          '#fff'
        )
      );
      setFontFamily(
        $getSelectionStyleValueForProperty(selection, 'font-family', 'Arial')
      );
      let matchingParent;
      if ($isLinkNode(parent)) {
        // If node is a link, we need to fetch the parent paragraph node to set format
        matchingParent = $findMatchingParent(
          node,
          (parentNode) => $isElementNode(parentNode) && !parentNode.isInline()
        );
      }

      // If matchingParent is a valid node, pass it's format type
      setElementFormat(
        $isElementNode(matchingParent)
          ? matchingParent.getFormatType()
          : $isElementNode(node)
            ? node.getFormatType()
            : parent?.getFormatType() || 'left'
      );
    }
  }, [activeEditor]);

  const $updatePopup = useCallback(() => {
    editor.getEditorState().read(() => {
      // Should not to pop up the floating toolbar when using IME input
      if (editor.isComposing()) {
        return;
      }
      const selection = $getSelection();
      const nativeSelection = window.getSelection();
      const rootElement = editor.getRootElement();

      if (
        nativeSelection !== null &&
        (!$isRangeSelection(selection) ||
          rootElement === null ||
          !rootElement.contains(nativeSelection.anchorNode))
      ) {
        setIsText(false);
        return;
      }

      if (!$isRangeSelection(selection)) {
        return;
      }

      const node = getSelectedNode(selection);

      if (
        !$isCodeHighlightNode(selection.anchor.getNode()) &&
        selection.getTextContent() !== ''
      ) {
        setIsText($isTextNode(node) || $isParagraphNode(node));
      } else {
        setIsText(false);
      }

      const rawTextContent = selection.getTextContent().replace(/\n/g, '');
      if (!selection.isCollapsed() && rawTextContent === '') {
        setIsText(false);
        return;
      }
    });
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          $updateToolbar();
          setActiveEditor(newEditor);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, $updateToolbar]);

  useEffect(() => {
    return mergeRegister(
      editor.registerEditableListener((editable) => {
        setIsEditable(editable);
      }),
      activeEditor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
          $updatePopup();
        });
      }),
      activeEditor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      activeEditor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [$updatePopup, $updateToolbar, activeEditor, editor]);

  useEffect(() => {
    document.addEventListener('selectionchange', $updatePopup);
    return () => {
      document.removeEventListener('selectionchange', $updatePopup);
    };
  }, [$updatePopup]);

  return {
    activeEditor,
    isEditable,
    blockType,
    rootType,
    selectedElementKey,
    fontSize,
    fontColor,
    bgColor,
    fontFamily,
    elementFormat,
    isLink,
    isBold,
    isItalic,
    isUnderline,
    isStrikethrough,
    isSubscript,
    isSuperscript,
    isCode,
    canUndo,
    canRedo,
    isRTL,
    codeLanguage,
    isText,
  };
}
