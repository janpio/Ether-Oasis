/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable tailwindcss/no-custom-classname */
import React, { useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';

import type { AlchemyToken } from '@/api/types/tokenTypes';

import PortfolioRow from './PortfolioRow';

type PortfolioProps = {
  tokensInWallet: AlchemyToken[];
  tokensWithPrices: { [tokenSymbol: string]: number };
  ethPrice: number;
  fetching?: boolean;
};

const Portfolio = ({
  tokensInWallet,
  tokensWithPrices,
  ethPrice,
  fetching,
}: PortfolioProps) => {
  const [totalValue, setTotalValue] = useState(0);

  useMemo(() => {
    const calculateTotalValue = () => {
      const tokenValue = tokensInWallet.reduce(
        (total, token) =>
          total +
          (tokensWithPrices[token.symbol.toLowerCase()] ?? 0) *
            Number(token.balance),
        0
      );
      return tokenValue;
    };

    setTotalValue(calculateTotalValue());
  }, [ethPrice, tokensWithPrices, tokensInWallet]);

  if (fetching) {
    return (
      <div className="mt-3 flex flex-col">
        <div className="flex flex-row items-center justify-between">
          <div className="-mt-3 text-2xl font-bold">Portfolio</div>
          <div className="ml-2 text-2xl font-bold">
            <Skeleton width={120} />
          </div>
        </div>
        <table className="portfolio-table mt-2 table-fixed">
          <thead>
            <tr>
              <th className="w-2/12 text-left text-xl">Token</th>
              <th className="w-3/12 text-left text-xl">Price</th>
              <th className="w-4/12 text-left text-xl">Balance</th>
              <th className="w-3/12 text-right text-xl">Value</th>
            </tr>
          </thead>
          <tbody className="text-lg">
            <tr className="border-b border-gray-700">
              <td>
                <Skeleton width={50} height={28} />
              </td>
              <td>
                <Skeleton width={75} height={28} />
              </td>
              <td>
                <Skeleton width={75} height={28} />
              </td>
              <td className="text-right">
                <Skeleton width={75} height={28} />
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td>
                <Skeleton width={50} height={28} />
              </td>
              <td>
                <Skeleton width={75} height={28} />
              </td>
              <td>
                <Skeleton width={75} height={28} />
              </td>
              <td className="text-right">
                <Skeleton width={75} height={28} />
              </td>
            </tr>
            <tr className="border-b border-gray-700">
              <td>
                <Skeleton width={50} height={28} />
              </td>
              <td>
                <Skeleton width={75} height={28} />
              </td>
              <td>
                <Skeleton width={75} height={28} />
              </td>
              <td className="text-right">
                <Skeleton width={75} height={28} />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col">
      <div className="flex flex-row items-center justify-between">
        <div className="-mt-3 text-2xl font-bold">Portfolio</div>
        <div className="ml-2 text-2xl font-bold">${totalValue.toFixed(2)}</div>
      </div>
      <table className="portfolio-table mt-2 table-fixed">
        <thead>
          <tr>
            <th className="w-2/12 text-left text-xl">Token</th>
            <th className="w-3/12 text-left text-xl">Price</th>
            <th className="w-4/12 text-left text-xl">Balance</th>
            <th className="w-3/12 text-right text-xl">Value</th>
          </tr>
        </thead>
        <tbody className="text-lg">
          {tokensInWallet.map((token) => (
            <PortfolioRow
              key={token.symbol}
              token={token}
              tokenPrice={
                tokensWithPrices[token.symbol.toLowerCase()]
                  ? tokensWithPrices[token.symbol.toLowerCase()]
                  : 0
              }
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
