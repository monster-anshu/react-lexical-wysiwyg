import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
} from 'lexical';
import { $getNearestBlockElementAncestorOrThrow } from '@lexical/utils';
import { $isHeadingNode, $isQuoteNode } from '@lexical/rich-text';
import { $isDecoratorBlockNode } from '@lexical/react/LexicalDecoratorBlockNode';

export function $clearFormatting() {
  const selection = $getSelection();
  if ($isRangeSelection(selection)) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const nodes = selection.getNodes();

    if (anchor.key === focus.key && anchor.offset === focus.offset) {
      return;
    }

    nodes.forEach((node, idx) => {
      // We split the first and last node by the selection
      // So that we don't format unselected text inside those nodes
      if ($isTextNode(node)) {
        // Use a separate variable to ensure TS does not lose the refinement
        let textNode = node;
        if (idx === 0 && anchor.offset !== 0) {
          textNode = textNode.splitText(anchor.offset)[1] || textNode;
        }
        if (idx === nodes.length - 1) {
          textNode = textNode.splitText(focus.offset)[0] || textNode;
        }

        if (textNode.__style !== '') {
          textNode.setStyle('');
        }
        if (textNode.__format !== 0) {
          textNode.setFormat(0);
          $getNearestBlockElementAncestorOrThrow(textNode).setFormat('');
        }
        node = textNode;
      } else if ($isHeadingNode(node) || $isQuoteNode(node)) {
        node.replace($createParagraphNode(), true);
      } else if ($isDecoratorBlockNode(node)) {
        node.setFormat('');
      }
    });
  }
}
