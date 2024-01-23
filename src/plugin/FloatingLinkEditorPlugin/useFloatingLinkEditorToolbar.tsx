import React, { Dispatch, useEffect } from 'react';
import { $findMatchingParent, mergeRegister } from '@lexical/utils';
import {
  $getSelection,
  $isRangeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  LexicalEditor,
} from 'lexical';
import { createPortal } from 'react-dom';
import { $isLinkNode } from '@lexical/link';
import { getSelectedNode } from '@/utils/getSelectedNode';
import FloatingLinkEditor from './FloatingLinkEditor';
import { useFormat } from '@/hooks/useFormat';

export default function useFloatingLinkEditorToolbar(
  editor: LexicalEditor,
  anchorElem: HTMLElement,
  isLinkEditMode: boolean,
  setIsLinkEditMode: Dispatch<boolean>
) {
  const { activeEditor, isLink } = useFormat();

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand(
        CLICK_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            const node = getSelectedNode(selection);
            const linkNode = $findMatchingParent(node, $isLinkNode);
            if ($isLinkNode(linkNode) && (payload.metaKey || payload.ctrlKey)) {
              window.open(linkNode.getURL(), '_blank');
              return true;
            }
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor]);

  if (!isLink) {
    return null;
  }

  return createPortal(
    <FloatingLinkEditor
      editor={activeEditor}
      isLink={isLink}
      anchorElem={anchorElem}
      isLinkEditMode={isLinkEditMode}
      setIsLinkEditMode={setIsLinkEditMode}
    />,
    anchorElem
  );
}
