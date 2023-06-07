import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

type Props = {
  exchangeId: string,
  setSwapData: (data: any) => void;
  switchToEthSwap: (val: boolean) => void;
}

interface Exchange {
  _id: string;
  tokenSymbol: string;
  ethBalance: number;
  tokenBalance: number;
  LP_names: string;
}

export const TokenToEthSwaps: React.FC<Props> = ({ exchangeId, setSwapData, switchToEthSwap }) => {
  const [exchangeData, setExchangeData] = useState<Exchange>();
  const [tokenNum, setTokenNum] = useState(0);
  const [ethNum, setEthNum] = useState(0);
  const [slippage, setSlippage] = useState(0);

  useEffect(() => {
    (async () => {
      await updateExchangeData();
    })();
  }, []);

  const updateExchangeData = async () => {
    const exchangeData = await api.get('exchanges/' + exchangeId);
    setExchangeData(exchangeData.data);
  }

  const handleSetTokenNum = async (val: number) => {
    const ethAmountSlippageResponse = await api.post('exchanges/eth-amount/slippage/' + exchangeId, {
      amount: val
    });
    setTokenNum(val);
    setEthNum(Math.round(ethAmountSlippageResponse.data.price * 1000) / 1000);
    setSlippage(Math.round(ethAmountSlippageResponse.data.slippage * 1000) / 1000);
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await api.post('exchanges/token-to-eth/' + exchangeId, {
      amount: tokenNum,
      ethId: localStorage.getItem('ETH'),
      // @ts-ignore
      tokenId: localStorage.getItem(exchangeData?.tokenSymbol),
    }).then(async () => {
      setSwapData({});
    });
  };

  const handleGoBack = () => {
    setSwapData({});
    switchToEthSwap(true);
  }

  return (
    <div>
      <span className='text-blue-400 italic font-bold text-xl underline cursor-pointer' onClick={handleGoBack}>Go Back</span>

      <table className="table-fixed invisible">
        <tbody>
        <tr className='border-b-2 h-12 cursor-pointer'>
          <td className='w-48 font-bold'>ETH</td>
          <td className='w-48'>-</td>
          <td className='w-48 font-bold'>test</td>
        </tr>
        </tbody>
      </table>

      <div className="mt-10">
        <h2 className='text-center text-3xl mb-5'>{exchangeData?.tokenSymbol} <span className='font-bold text-green-600 cursor-pointer' onClick={() => switchToEthSwap(true)}> -&gt;</span>  ETH</h2>

        <h4 className='mb-2 text-xl'>ETH balance: {Math.round(Number(exchangeData?.ethBalance) * 1000) / 1000}</h4>
        <h4 className='mb-2 text-xl'>{exchangeData?.tokenSymbol} balance: {Math.round(Number(exchangeData?.tokenBalance) * 1000) / 1000}</h4>
        {/* @ts-ignore */}
        <h4 className='mb-5 text-xl'>Rate without slippage: {Math.round((Number(exchangeData?.ethBalance / exchangeData?.tokenBalance) * tokenNum) * 1000) / 1000} ETH</h4>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className='flex justify-between items-center'>
              <input
                id="symbol"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                value={tokenNum}
                onChange={(event) => handleSetTokenNum(Number(event.target.value))}
              />
              <span className='block font-bold text-blue-600 text-2xl ml-5'>{exchangeData?.tokenSymbol}</span>
            </div>
            <div className='flex justify-between items-center mt-8'>
              <input
                id="symbol"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                value={ethNum}
                readOnly={true}
              />
              <span className='block font-bold text-blue-600 text-2xl ml-5'>ETH</span>
            </div>
          </div>
          <div className="flex justify-center mt-10">
            <button type="submit"
                    className="w-full text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-3 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Swap
            </button>
          </div>
        </form>

        <h3 className='text-red-400 text-2xl font-bold text-center mt-10'>Slippage: {slippage} ETH</h3>
      </div>
    </div>
  );
}