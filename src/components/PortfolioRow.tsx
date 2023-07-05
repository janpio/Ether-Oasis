import { ethers } from 'ethers';
import React, { useMemo, useState } from 'react';

import type { AlchemyToken } from '@/api/types/tokenTypes';

type PortfolioRowProps = {
  token: AlchemyToken;
  tokenPrice: number | undefined;
};

const PortfolioRow = ({ token, tokenPrice }: PortfolioRowProps) => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [formattedValue, setFormattedValue] = useState('');

  useMemo(() => {
    if (tokenPrice && token) {
      setTotalBalance(Number(ethers.formatEther(token.tokenBalance)));
    }
  }, [tokenPrice, token]);

  useMemo(() => {
    if (tokenPrice && totalBalance > 0) {
      const value = tokenPrice * totalBalance;
      const formatted = Number.isNaN(value) ? '-' : value.toFixed(2);
      setFormattedValue(formatted);
    }
  }, [token, tokenPrice, totalBalance]);

  return (
    <tr key={token.symbol} className="border-b border-gray-700">
      <td className="w-3/12 text-left">
        <img
          className="-mt-1 mr-2 inline-block h-6 w-6 rounded-full"
          src={token.logo}
          alt={token.symbol}
        />
        {token.symbol}
      </td>
      <td className="w-3/12 text-left">
        $
        {tokenPrice && tokenPrice < 0.001
          ? '<0.001'
          : tokenPrice?.toFixed(3).replace(/\.?0+$/, '')}
      </td>
      <td className="w-3/12 text-left">{totalBalance.toFixed(5)}</td>
      <td className="w-3/12 text-right">${formattedValue}</td>
    </tr>
  );
};

export default PortfolioRow;
