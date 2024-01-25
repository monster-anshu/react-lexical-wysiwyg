import React, { Suspense } from 'react';

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
  Spread,
} from 'lexical';

import { $applyNodeReplacement, DecoratorNode } from 'lexical';

const InlineImageComponent = React.lazy(() =>
  import('./InlineImageComponent').then((module) => ({
    default: module.InlineImageComponent,
  }))
);

export type Position = 'left' | 'right' | 'full' | undefined;

export interface InlineImagePayload {
  altText: string;
  height?: number;
  key?: NodeKey;
  src: string;
  width?: number;
  position?: Position;
}

export interface UpdateInlineImagePayload {
  altText?: string;
  position?: Position;
}

function convertInlineImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src, width, height, dataset } = domNode;
    const type = dataset.type;
    if (type !== 'inline-image') {
      return null;
    }
    const node = $createInlineImageNode({ altText, height, src, width });
    return { node };
  }
  return null;
}

export type SerializedInlineImageNode = Spread<
  {
    altText: string;
    height?: number;
    src: string;
    width?: number;
    position?: Position;
  },
  SerializedLexicalNode
>;

export class InlineImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: 'inherit' | number;
  __height: 'inherit' | number;
  __position: Position;

  static getType(): string {
    return 'inline-image';
  }

  static clone(node: InlineImageNode): InlineImageNode {
    return new InlineImageNode(
      node.__src,
      node.__altText,
      node.__position,
      node.__width,
      node.__height,
      node.__key
    );
  }

  static importJSON(
    serializedNode: SerializedInlineImageNode
  ): InlineImageNode {
    const { altText, height, width, src, position } = serializedNode;
    const node = $createInlineImageNode({
      altText,
      height,
      position,
      src,
      width,
    });
    return node;
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: () => ({
        conversion: convertInlineImageElement,
        priority: 0,
      }),
    };
  }

  constructor(
    src: string,
    altText: string,
    position: Position,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__position = position;
  }

  exportDOM(): DOMExportOutput {
    const img = document.createElement('img');
    img.setAttribute('src', this.__src);
    img.setAttribute('alt', this.__altText);
    img.setAttribute('width', this.__width.toString());
    img.setAttribute('height', this.__height.toString());
    const element = document.createElement('span');
    if (this.__position === 'left') element.classList.add('position-left');
    if (this.__position === 'right') element.classList.add('position-right');
    element.appendChild(img);
    element.classList.add('inline-editor-image');
    return { element };
  }

  exportJSON(): SerializedInlineImageNode {
    return {
      altText: this.getAltText(),
      height: this.__height === 'inherit' ? 0 : this.__height,
      position: this.__position,
      src: this.getSrc(),
      type: 'inline-image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  setAltText(altText: string): void {
    const writable = this.getWritable();
    writable.__altText = altText;
  }

  setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  getPosition(): Position {
    return this.__position;
  }

  setPosition(position: Position): void {
    const writable = this.getWritable();
    writable.__position = position;
  }

  update(payload: UpdateInlineImagePayload): void {
    const writable = this.getWritable();
    const { altText, position } = payload;
    if (altText !== undefined) {
      writable.__altText = altText;
    }
    if (position !== undefined) {
      writable.__position = position;
    }
  }

  setSrc(src: string): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const className = `${config.theme.inlineImage} position-${this.__position}`;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(
    prevNode: InlineImageNode,
    dom: HTMLElement,
    config: EditorConfig
  ): false {
    const position = this.__position;
    if (position !== prevNode.__position) {
      const className = `${config.theme.inlineImage} position-${position}`;
      if (className !== undefined) {
        dom.className = className;
      }
    }
    return false;
  }

  decorate() {
    return (
      <Suspense fallback={null}>
        <InlineImageComponent
          src={this.__src}
          altText={this.__altText}
          width={this.__width}
          height={this.__height}
          nodeKey={this.getKey()}
          position={this.__position}
        />
      </Suspense>
    );
  }
}

export function $createInlineImageNode({
  altText,
  position,
  height,
  src,
  width,
  key,
}: InlineImagePayload): InlineImageNode {
  return $applyNodeReplacement(
    new InlineImageNode(src, altText, position, width, height, key)
  );
}

export function $isInlineImageNode(
  node: LexicalNode | null | undefined
): node is InlineImageNode {
  return node instanceof InlineImageNode;
}
