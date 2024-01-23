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
import { ImageNode } from '@/nodes/ImageNode';
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
  onImageUpload?(file: InsertImagePayload): Promise<string | null>;
}

export default function ImagePlugin({ onImageUpload }: IImageComponentProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagePlugin: ImageNode not registered on editor');
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
            onImageUpload(payload).then((src) => {
              if (!src) return;
              editor.update(() => {
                createdNode.setSrc(src);
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
  }, [editor]);

  return null;
}
