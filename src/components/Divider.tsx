import React, { FC } from 'react';

export interface IDividerProps {}

const Divider: FC<IDividerProps> = ({}) => {
  return <div className='hidden'>|</div>;
};

export default Divider;
