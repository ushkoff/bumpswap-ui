import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

interface Exchange {
  _id: string;
  tokenSymbol: string;
  ethBalance: number;
  tokenBalance: number;
  LP_names: string;
}

type Props = {
  setSwapData: (data: any) => void;
}

export const Exchanges: React.FC<Props> = ({ setSwapData }) => {
  const [exchanges, setExchanges] = useState<Exchange[]>([]);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [symbol, setSymbol] = useState('');
  const [fee, setFee] = useState(0);

  const handleOpenForm = () => setIsOpened(val => !val);

  useEffect(() => {
    (async () => {
      await updateExchanges();
    })();
  }, []);

  const updateExchanges = async () => {
    const exchanges = await api.get('exchanges');
    setExchanges(exchanges.data);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await api.post('exchanges', {
      tokenSymbol: symbol,
      feePercentage: fee,
      tokenId: localStorage.getItem(symbol),
    }).then(async () => {
      setSymbol('');
      setFee(0);
      setIsOpened(false);
      await updateExchanges();
    });
  };

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
        {exchanges.map(exchange => (
          <tr className='border-b-2 h-12 cursor-pointer' key={exchange._id} onClick={() => setSwapData({ exchangeId: exchange._id })}>
            <td className='w-48 font-bold'>ETH</td>
            <td className='w-48'>-</td>
            <td className='w-48 font-bold'>{exchange.tokenSymbol}</td>
          </tr>
        ))}
        </tbody>
      </table>

      <button type="button"
              className="mt-10 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-3 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleOpenForm}
      >
        Add Exchange
      </button>

      {isOpened && (
        <div className="mt-10">
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                Symbol
              </label>
              <input
                id="symbol"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                value={symbol}
                onChange={(event) => setSymbol(event.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700">
                Fee %
              </label>
              <input
                id="fee"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                value={fee}
                onChange={(event) => setFee(Number(event.target.value))}
              />
            </div>
            <div className="flex justify-center mt-10">
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}