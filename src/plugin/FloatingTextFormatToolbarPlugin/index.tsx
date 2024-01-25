import React from 'react';
import { createPortal } from 'react-dom';
import { TextFormatFloatingToolbar } from './TextFormatFloatingToolbar';
import { useFormat } from '@/hooks/useFormat';

function useFloatingTextFormatToolbar(anchorElem: HTMLElement) {
  const {
    isText,
    activeEditor,
    isLink,
    isBold,
    isItalic,
    isStrikethrough,
    isSubscript,
    isSuperscript,
    isUnderline,
    isCode,
  } = useFormat();

  if (!isText) {
    return null;
  }

  return createPortal(
    <TextFormatFloatingToolbar
      editor={activeEditor}
      anchorElem={anchorElem}
      isLink={isLink}
      isBold={isBold}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isSubscript={isSubscript}
      isSuperscript={isSuperscript}
      isUnderline={isUnderline}
      isCode={isCode}
    />,
    anchorElem
  );
}

export function FloatingTextFormatToolbarPlugin({
  anchorElem = document.body,
}: {
  anchorElem?: HTMLElement;
}) {
  return useFloatingTextFormatToolbar(anchorElem);
}
