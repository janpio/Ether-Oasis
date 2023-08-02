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
    if (token) {
      setTotalBalance(Number(token.balance));
    }
  }, [tokenPrice, token]);

  useMemo(() => {
    if (totalBalance > 0) {
      const value = tokenPrice ? tokenPrice * totalBalance : 0;
      const formatted = Number.isNaN(value) ? '-' : value.toFixed(2);
      if (formatted.length > 0) {
        setFormattedValue(formatted);
      } else {
        setFormattedValue('-');
      }
    }
  }, [token, tokenPrice, totalBalance]);

  return (
    <tr key={token.symbol} className="border-b border-gray-700 text-lg">
      <td className="w-4/12 pt-1 text-left">
        <img
          className={`-mt-1 mr-2 inline-block h-8 w-8 ${
            token.symbol === 'ETH' ? '' : 'rounded-full'
          }`}
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
      <td className="w-3/12 text-left">{totalBalance.toFixed(3)}</td>
      <td className="w-2/12 text-right">${formattedValue}</td>
    </tr>
  );
};

export default PortfolioRow;
