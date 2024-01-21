import React, { FC } from 'react';

export interface IDividerProps {}

const Divider: FC<IDividerProps> = ({}) => {
  return <div className='mx-1 self-stretch bg-slate-200 px-[0.5px]'></div>;
};

export default Divider;
