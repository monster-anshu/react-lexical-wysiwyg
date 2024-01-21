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
import {
  INSERT_INLINE_IMAGE_COMMAND,
  InsertInlineImagePayload,
  MOVE_INLINE_IMAGE_COMMAND,
  insertFromPayload,
  onDragStart,
  onDragover,
  onDrop,
} from './functions';
import {
  $createInlineImageNode,
  InlineImageNode,
  InlineImagePayload,
} from '@/nodes/InlineImageNode';

interface IImageComponentProps {
  captionsEnabled?: boolean;
  onImageUpload?(file: InsertInlineImagePayload): Promise<InlineImagePayload>;
}

export default function ImagesPlugin({
  captionsEnabled,
  onImageUpload,
}: IImageComponentProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([InlineImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }

    return mergeRegister(
      editor.registerCommand(
        INSERT_INLINE_IMAGE_COMMAND,
        (payload) => {
          const { file, src, position, altText } = payload;
          let url = src;
          if (file) {
            url = URL.createObjectURL(file);
          }
          if (!url) {
            return false;
          }
          const createdNode = insertFromPayload({
            src: url,
            position,
            altText: altText || file?.name || '',
          });
          if (file && onImageUpload) {
            onImageUpload(payload).then((payload) => {
              editor.update(() => {
                const imageNode = $createInlineImageNode(payload);
                imageNode.setPosition(createdNode.getPosition());
                imageNode.setWidthAndHeight(
                  imageNode.__width,
                  imageNode.__height
                );
                createdNode.replace(imageNode);
              });
            });
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR
      ),
      editor.registerCommand(
        MOVE_INLINE_IMAGE_COMMAND,
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
