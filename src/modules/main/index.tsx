import React from 'react';
import { Exchanges } from '../Exchanges';
import { Tokens } from '../tokens';

export const Main: React.FC = () => {
  return (
    <div className='mt-20 w-100'>
      <div className='flex justify-between items-start gap-20'>
        <Exchanges/>
        <Tokens/>
      </div>
    </div>
  );
}