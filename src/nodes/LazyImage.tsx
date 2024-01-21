import React, { RefObject } from 'react';

export interface ILazyImageProps {
  altText: string;
  className: string | null;
  imageRef: RefObject<HTMLImageElement>;
  src: string;
  position?: string;
  style?: React.CSSProperties;
}

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

export function LazyImage({
  altText,
  className,
  imageRef,
  src,
  position,
  style,
}: ILazyImageProps) {
  useSuspenseImage(src);
  return (
    <img
      className={className || undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      draggable='false'
      data-position={position}
      style={style}
    />
  );
}
