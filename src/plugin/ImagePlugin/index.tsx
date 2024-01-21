import { useEffect } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import {
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
} from 'lexical';
import { $createImageNode, ImageNode, ImagePayload } from '@/nodes/ImageNode';
import {
  INSERT_IMAGE_COMMAND,
  InsertImagePayload,
  MOVE_IMAGE_COMMAND,
  insertFromPayload,
  onDragStart,
  onDragover,
  onDrop,
} from './functions';

interface IImageComponentProps {
  captionsEnabled?: boolean;
  onImageUpload?(file: InsertImagePayload): Promise<ImagePayload>;
}

export default function InlineImagePlugin({
  captionsEnabled,
  onImageUpload,
}: IImageComponentProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('InlineImagePlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const { altText, file, src } = payload;
          let url = src;
          if (file) {
            url = URL.createObjectURL(file);
          }
          if (!url) {
            return false;
          }
          const createdNode = insertFromPayload({
            altText: altText || file?.name || '',
            src: url,
          });
          if (file && onImageUpload) {
            onImageUpload(payload).then((payload) => {
              editor.update(() => {
                const imageNode = $createImageNode(payload);
                createdNode.replace(imageNode);
              });
            });
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        MOVE_IMAGE_COMMAND,
        (payload) => {
          insertFromPayload(payload);
          return true;
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => {
          return onDragStart(event);
        },
        COMMAND_PRIORITY_HIGH
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => {
          return onDragover(event);
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => {
          return onDrop(event, editor);
        },
        COMMAND_PRIORITY_HIGH
      )
    );
  }, [captionsEnabled, editor]);

  return null;
}
