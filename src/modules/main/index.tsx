import React, { useState } from 'react';
import { Exchanges } from '../Exchanges';
import { Tokens } from '../tokens';
import { EthToTokenSwaps } from '../Swaps/ethToToken';
import { TokenToEthSwaps } from '../Swaps/tokenToEth';

export const Main: React.FC = () => {
  const [data, setData] = useState<any>({});
  const [ethToToken, setEthToToken] = useState<boolean>(true);

  const handleSetData = (val: any) => {
    setData(val);
  }

  return (
    <div className='mt-20 w-100'>
      {Object.keys(data).length === 0 ? (
        <div className='flex justify-between items-start gap-20'>
          <Exchanges setSwapData={handleSetData}/>
          <Tokens/>
        </div>
      ) : (
        <div className='flex justify-between items-start gap-20'>
          {ethToToken ? (
            <EthToTokenSwaps exchangeId={data.exchangeId} setSwapData={handleSetData} switchToEthSwap={setEthToToken}/>
          ) : (
            <TokenToEthSwaps exchangeId={data.exchangeId} setSwapData={handleSetData} switchToEthSwap={setEthToToken}/>
          )}
          <Exchanges setSwapData={handleSetData}/>
        </div>
      )}
    </div>
  );
}