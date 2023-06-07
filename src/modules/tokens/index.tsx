import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api';

interface Token {
  _id: string;
  symbol: string;
  name: string;
  totalSupply: number;
}

export const Tokens: React.FC = () => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const [symbol, setSymbol] = useState('');
  const [name, setName] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);

  const handleOpenForm = () => setIsOpened(val => !val);

  useEffect(() => {
    (async () => {
      await updateTokens();
    })();
  }, []);

  const updateTokens = async () => {
    const tokens = await api.get('tokens');
    setTokens(tokens.data);

    tokens.data.forEach((token: Token) => {
      localStorage.setItem(token.symbol, token._id);
    });
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    await api.post('tokens', {
      symbol,
      name,
      totalSupply
    }).then(async () => {
      setSymbol('');
      setName('');
      setTotalSupply(0);
      setIsOpened(false);
      await updateTokens();
    });
  };

  return (
    <div className='text-center w-1/2 flex justify-center flex-col'>
      <h2 className='text-2xl font-bold uppercase mb-5 block'>Tokens</h2>

      <table className="table-fixed w-full">
        <thead>
        <tr className="bg-slate-700 text-white">
          <th className="w-1/3 py-2">Symbol</th>
          <th className="w-1/3 py-2">Name</th>
          <th className="w-1/3 py-2">Balance</th>
        </tr>
        </thead>
        <tbody>
        {tokens.map((token) => (
          <tr className="border-b-2 h-12" key={token._id}>
            <td className="w-1/3 py-2 font-bold">{`(${token.symbol})`}</td>
            <td className="w-1/3 py-2">{token.name}</td>
            <td className="w-1/3 py-2">{Math.round(token.totalSupply * 1000) / 1000}</td>
          </tr>
        ))}
        </tbody>
      </table>

      <button type="button"
              className="mt-10 text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-3 text-center mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              onClick={handleOpenForm}
      >
        Add Token
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
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="totalSupply" className="block text-sm font-medium text-gray-700">
                Total Supply
              </label>
              <input
                id="totalSupply"
                type="text"
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md h-10 text-center"
                value={totalSupply}
                onChange={(event) => setTotalSupply(Number(event.target.value))}
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