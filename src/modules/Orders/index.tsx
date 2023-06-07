import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

interface Order {
  _id: string;
  tokenId: string;
  tokenSymbol: string;
  ethId: string;
  tokenAmount: number;
  ethAmount: number;
  exchangeId: string;
  isEthToToken: number;
  minPrice: number;
}

type Props = {
  exchangeId: string;
}

export const Orders: React.FC<Props> = ({ exchangeId }) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [symbol, setSymbol] = useState<string>('');
  const [ethNum, setEthNum] = useState<number>(0);
  const [tokenNum, setTokenNum] = useState<number>(0);
  const [ethToToken, setEthToToken] = useState<number>(0);
  const [minPrice, setMinPrice] = useState<string>('0');

  const handleOpenForm = () => setIsOpened(val => !val);

  useEffect(() => {
    (async () => {
      await updateOrders();
    })();
  }, []);

  const updateOrders = async () => {
    const orders = await api.get('orders');
    setOrders(orders.data.filter((order: any) => order.exchangeId === exchangeId));
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    console.log({
      tokenId: localStorage.getItem(symbol),
      tokenSymbol: symbol,
      ethId: localStorage.getItem('ETH'),
      tokenAmount: tokenNum,
      ethAmount: ethNum,
      exchangeId,
      isEthToToken: ethToToken,
      minPrice: Number(minPrice)
    })

    await api.post('orders', {
      tokenId: localStorage.getItem(symbol),
      tokenSymbol: symbol,
      ethId: localStorage.getItem('ETH'),
      tokenAmount: tokenNum,
      ethAmount: ethNum,
      exchangeId,
      isEthToToken: ethToToken,
      minPrice: Number(minPrice)
    }).then(async () => {
      setSymbol('');
      setEthNum(0);
      setTokenNum(0);
      setEthToToken(0);
      setMinPrice('0');
      await updateOrders();
    });
  };

  return (
    <div className='w-full flex justify-center mb-20'>
      <div className='text-center w-1/2 flex justify-center flex-col mt-16'>
        <h2 className='text-2xl font-bold uppercase mb-5 block'>ORDERS</h2>

        <table className="table-fixed">
          <thead>
          <tr className='bg-slate-700 text-white'>
            <th className='py-2'>Currency 1</th>
            <th className='py-2'></th>
            <th className='py-2'>Currency 2</th>
            <th className='py-2'>Eth amount</th>
            <th className='py-2'>Token amount</th>
            <th className='py-2'>Min Price</th>
          </tr>
          </thead>
          <tbody>
          {orders.map(order => (
            <tr className='border-b-2 h-12' key={order._id}>
              <td className='w-48 font-bold'>{order.isEthToToken == 1 ? 'ETH' : order.tokenSymbol}</td>
              <td className='w-48'>-&gt;</td>
              <td className='w-48 font-bold'>{order.isEthToToken == 1 ? order.tokenSymbol : 'ETH'}</td>
              <td className='w-48 font-bold'>{order.ethAmount}</td>
              <td className='w-48 font-bold'>{order.tokenAmount}</td>
              <td className='w-48 font-bold'>{order.minPrice} {order.isEthToToken == 1 ? order.tokenSymbol : 'ETH'}</td>
            </tr>
          ))}
          </tbody>
        </table>

        <button type="button"
                className="mt-10 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-3 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                onClick={handleOpenForm}
        >
          Add Order
        </button>

        {isOpened && (
          <div className="mt-10">
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="symbol" className="block text-sm font-medium text-gray-700">
                  Token Symbol
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
                  ETH Amount
                </label>
                <input
                  id="ethNum"
                  type="text"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                  value={ethNum}
                  onChange={(event) => setEthNum(Number(event.target.value))}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700">
                  Token Amount
                </label>
                <input
                  id="ethNum"
                  type="text"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                  value={tokenNum}
                  onChange={(event) => setTokenNum(Number(event.target.value))}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700">
                  is ETH -&gt; Token?
                </label>
                <input
                  id="minPrice"
                  type="text"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                  value={ethToToken}
                  onChange={(event) => setEthToToken(Number(event.target.value))}
                />
              </div>
              <div className="mb-4">
                <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700">
                  Min Price
                </label>
                <input
                  id="minPrice"
                  type="text"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                  value={minPrice}
                  onChange={(event) => setMinPrice(event.target.value)}
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
    </div>
  );
}