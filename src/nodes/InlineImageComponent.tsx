import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import type { Position } from './InlineImageNode';
import type { BaseSelection, LexicalEditor, NodeKey } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DRAGSTART_COMMAND,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
  SELECTION_CHANGE_COMMAND,
} from 'lexical';

import { useModal } from '@/hooks/useModal';
import { Button } from '@/ui/Button';
import { TextInput } from '@/ui/TextInput';
import { $isInlineImageNode, InlineImageNode } from './InlineImageNode';
import { LazyImage } from './LazyImage';
import { twMerge } from 'tailwind-merge';
import { ImageResizer } from '@/ui/ImageResizer';
import { RIGHT_CLICK_IMAGE_COMMAND } from './ImageComponent';

export interface IInlineImageComponentProps {
  altText: string;
  height: 'inherit' | number;
  nodeKey: NodeKey;
  src: string;
  width: 'inherit' | number;
  position: Position;
}

export function InlineImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  position,
}: IInlineImageComponentProps) {
  const [modal, showModal] = useModal();
  const imageRef = useRef<null | HTMLImageElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<BaseSelection | null>(null);
  const activeEditorRef = useRef<LexicalEditor | null>(null);
  const [isResizing, setIsResizing] = useState<boolean>(false);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isInlineImageNode(node)) {
          node.remove();
        }
      }
      return false;
    },
    [isSelected, nodeKey]
  );

  const onClick = useCallback(
    (payload: MouseEvent) => {
      const event = payload;

      if (isResizing) {
        return true;
      }
      if (event.target === imageRef.current) {
        if (event.shiftKey) {
          setSelected(!isSelected);
        } else {
          clearSelection();
          setSelected(true);
        }
        return true;
      }

      return false;
    },
    [isResizing, isSelected, setSelected, clearSelection]
  );

  useEffect(() => {
    let isMounted = true;
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        if (isMounted) {
          setSelection(editorState.read(() => $getSelection()));
        }
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_, activeEditor) => {
          activeEditorRef.current = activeEditor;
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand<MouseEvent>(
        RIGHT_CLICK_IMAGE_COMMAND,
        onClick,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        DRAGSTART_COMMAND,
        (event) => {
          if (event.target === imageRef.current) {
            // TODO This is just a temporary workaround for FF to behave like other browsers.
            // Ideally, this handles drag & drop too (and all browsers).
            event.preventDefault();
            return true;
          }
          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
    return () => {
      isMounted = false;
      unregister();
    };
  }, [
    clearSelection,
    editor,
    isSelected,
    nodeKey,
    onDelete,
    setSelected,
    onClick,
  ]);

  const onResizeEnd = (
    nextWidth: 'inherit' | number,
    nextHeight: 'inherit' | number
  ) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => {
      setIsResizing(false);
    }, 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isInlineImageNode(node)) {
        node.setWidthAndHeight(nextWidth, nextHeight);
      }
    });
  };

  const onResizeStart = () => {
    setIsResizing(true);
  };

  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = isSelected;
  return (
    <Suspense fallback={null}>
      <>
        <div draggable={draggable}>
          <button
            className='absolute right-2 top-2 rounded bg-black/50 px-4 py-2 text-white drop-shadow'
            ref={buttonRef}
            onClick={() => {
              showModal('Update Inline Image', (onClose) => (
                <UpdateInlineImageDialog
                  activeEditor={editor}
                  nodeKey={nodeKey}
                  onClose={onClose}
                />
              ));
            }}
          >
            Edit
          </button>
          <LazyImage
            className={twMerge(
              isFocused && 'select-none outline outline-2 outline-violet-500',
              isFocused && $isNodeSelection(selection)
                ? 'cursor-grab active:cursor-grabbing'
                : ''
            )}
            src={src}
            altText={altText}
            imageRef={imageRef}
            style={{
              width,
              height,
            }}
            position={position}
          />
        </div>
        {$isNodeSelection(selection) && isFocused && (
          <ImageResizer
            editor={editor}
            buttonRef={buttonRef}
            imageRef={imageRef}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
          />
        )}
      </>
      {modal}
    </Suspense>
  );
}

interface IUpdateInlineImageDialogProps {
  activeEditor: LexicalEditor;
  nodeKey: NodeKey;
  onClose: () => void;
}

export function UpdateInlineImageDialog({
  activeEditor,
  nodeKey,
  onClose,
}: IUpdateInlineImageDialogProps) {
  const editorState = activeEditor.getEditorState();
  const node = editorState.read(
    () => $getNodeByKey(nodeKey) as InlineImageNode
  );
  const [altText, setAltText] = useState(node.getAltText());
  const [position, setPosition] = useState<Position>(node.getPosition());

  const handleOnConfirm = () => {
    const payload = { altText, position };
    if (node) {
      activeEditor.update(() => {
        node.update(payload);
      });
    }
    onClose();
  };

  return (
    <div className='space-y-2'>
      <div>
        <TextInput
          label='Alt Text'
          placeholder='Descriptive alternative text'
          onChange={setAltText}
          value={altText}
        />
      </div>

      <select
        onChange={(e) => setPosition(e.target.value as Position)}
        value={position}
        className='w-full rounded bg-gray-300'
      >
        <option value='left'>Left</option>
        <option value='right'>Right</option>
        <option value='full'>Full Width</option>
      </select>

      <Button onClick={() => handleOnConfirm()}>Confirm</Button>
    </div>
  );
}
