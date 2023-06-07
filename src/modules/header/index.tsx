import React from 'react';

export const Header: React.FC = () => {
  return (
    <div>
      <header className='py-4 flex justify-between items-center px-4'>
        <h1 className="text-3xl font-bold underline decoration-red-500 text-slate-800">
          BumpSwap
        </h1>
        <span className='text-xl font-bold text-blue-500 cursor-pointer'>bumpzz</span>
      </header>
      <hr/>
    </div>
  );
}