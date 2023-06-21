import { ethers } from 'ethers';
import React, { useEffect, useState } from 'react';

import { getTokenImage } from '@/api/tokens';
import type { Token } from '@/api/types/tokenTypes';

type PortfolioRowProps = {
  token: Token;
  tokenPrice: number | undefined;
};

const PortfolioRow = ({ token, tokenPrice }: PortfolioRowProps) => {
  const [totalBalance, setTotalBalance] = useState(0);
  const [formattedValue, setFormattedValue] = useState('');
  const [tokenImage, setTokenImage] = useState<string>('');

  useEffect(() => {
    if (tokenPrice && token) {
      setTotalBalance(Number(ethers.formatEther(token.totalBalance)));
    }
  }, [tokenPrice, token]);

  useEffect(() => {
    if (tokenPrice && totalBalance > 0) {
      const value = tokenPrice * totalBalance;
      const formatted = Number.isNaN(value) ? '-' : value.toFixed(2);
      setFormattedValue(formatted);
    }
  }, [token, tokenPrice, totalBalance]);

  useEffect(() => {
    if (token) {
      const fetchedTokenImage = getTokenImage(token.symbol);
      fetchedTokenImage.then((image) => {
        setTokenImage(image);
      });
    }
  }, [token]);

  return (
    <tr key={token.symbol}>
      <td className="w-3/12 text-left">
        <img
          className="mr-2 inline-block h-6 w-6 rounded-full"
          src={tokenImage}
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
