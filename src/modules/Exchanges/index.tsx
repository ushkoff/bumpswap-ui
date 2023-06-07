import React from 'react';

export const Exchanges: React.FC = () => {
  return (
    <div className='text-center w-1/2 flex justify-center flex-col'>
      <h2 className='text-2xl font-bold uppercase mb-5 block'>Exchanges</h2>

      <table className="table-fixed">
        <thead>
        <tr className='bg-slate-700 text-white'>
          <th className='py-2'>Currency 1</th>
          <th className='py-2'></th>
          <th className='py-2'>Currency 2</th>
        </tr>
        </thead>
        <tbody>
        <tr className='border-b-2 h-12 cursor-pointer'>
          <td className='w-48'>ETH</td>
          <td className='w-48'>-</td>
          <td className='w-48'>BMP</td>
        </tr>
        <tr className='border-b-2 h-12 cursor-pointer'>
          <td className='w-48'>ETH</td>
          <td className='w-48'>-</td>
          <td className='w-48'>RBK</td>
        </tr>
        </tbody>
      </table>
    </div>
  );
}