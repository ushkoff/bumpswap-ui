import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

type Props = {
  exchangeId: string;
  updateCounter: (val: number) => void;
}

interface Exchange {
  _id: string;
  tokenSymbol: string;
  ethBalance: number;
  tokenBalance: number;
  LP_names: string;
}

interface Token {
  _id: string;
  symbol: string;
  name: string;
  totalSupply: number;
}

export const Liquidity: React.FC<Props> = ({ exchangeId, updateCounter }) => {
  const [exchangeData, setExchangeData] = useState<Exchange>();
  const [ethNum, setEthNum] = useState(0);
  const [tokenNum, setTokenNum] = useState(0);
  const [tokens, setTokens] = useState<Token[]>([]);

  useEffect(() => {
    (async () => {
      await updateExchangeData();
    })();
  }, []);

  const updateExchangeData = async () => {
    const exchangeData = await api.get('exchanges/' + exchangeId);
    setExchangeData(exchangeData.data);
    const tokens = await api.get('tokens');
    setTokens(tokens.data);
  }

  const handleSetEthNum = async (val: number) => setEthNum(val);
  const handleSetTokenNum = async (val: number) => setTokenNum(val);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await api.post('exchanges/add-liquidity/' + exchangeId, {
      amount: ethNum,
      ethId: localStorage.getItem('ETH'),
      // @ts-ignore
      tokenId: localStorage.getItem(exchangeData?.tokenSymbol),
      tokenAmount: tokenNum,
      ethAmount: ethNum,
      LP_name: 'bumpzz'
    }).then(async () => {
      setEthNum(0);
      setTokenNum(0);
      await updateExchangeData();
      updateCounter(Date.now());
    });
  }

  return (
    <div>
      <table className="table-fixed invisible">
        <tbody>
        <tr className='border-b-2 h-12 cursor-pointer'>
          <td className='w-48 font-bold'>ETH</td>
          <td className='w-48'>-</td>
          <td className='w-48 font-bold'>test</td>
        </tr>
        </tbody>
      </table>

      <div className="mt-16">
        <h2 className='text-center text-3xl mb-5'>Add Liquidity</h2>

        {tokens.length > 0 && (<>
          <h4 className='mb-2 text-xl'>ETH balance: {Math.round(Number(tokens.filter((t: any) => t.symbol === 'ETH')[0].totalSupply) * 1000) / 1000}</h4>
          <h4 className='mb-2 text-xl'>{exchangeData?.tokenSymbol} balance: {Math.round(Number(tokens.filter((t: any) => t.symbol === exchangeData?.tokenSymbol)[0].totalSupply) * 1000) / 1000}</h4>
        </>)}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className='flex justify-between items-center'>
              <input
                id="symbol"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                value={ethNum}
                onChange={(event) => handleSetEthNum(Number(event.target.value))}
              />
              <span className='block font-bold text-blue-600 text-2xl ml-5'>ETH</span>
            </div>
            <div className='flex justify-between items-center mt-8'>
              <input
                id="symbol"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                value={tokenNum}
                onChange={(event) => handleSetTokenNum(Number(event.target.value))}
              />
              <span className='block font-bold text-blue-600 text-2xl ml-5'>{exchangeData?.tokenSymbol}</span>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button type="submit"
                    className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-3 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}