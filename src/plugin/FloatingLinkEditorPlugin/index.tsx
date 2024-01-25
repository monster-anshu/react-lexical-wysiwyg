import { useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useFloatingLinkEditorToolbar } from './useFloatingLinkEditorToolbar';

interface IFloatingLinkEditorPluginProps {
  anchorElem?: HTMLElement;
}

export function FloatingLinkEditorPlugin({
  anchorElem = document.body,
}: IFloatingLinkEditorPluginProps) {
  const [editor] = useLexicalComposerContext();
  const [isLinkEditMode, setIsLinkEditMode] = useState(true);

  return useFloatingLinkEditorToolbar(
    editor,
    anchorElem,
    isLinkEditMode,
    setIsLinkEditMode
  );
}
