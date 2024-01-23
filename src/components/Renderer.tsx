import React, { FC } from 'react';

export interface IRendererProps {
  children: string;
}

const Renderer: FC<IRendererProps> = ({ children }) => {
  return (
    <div
      className='ContentEditable__root text-sm'
      dangerouslySetInnerHTML={{
        __html: children,
      }}
    ></div>
  );
};

export default Renderer;
