/* eslint-disable no-console */
// TODO: somehow get token icons to display with ticker
/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers';
import { useContext, useEffect, useMemo, useState } from 'react';

import { getEthPrice, getTokenPrices, getTokens } from '@/api/tokens';
import type { Token } from '@/api/types/tokenTypes';
import { GlobalContext } from '@/context/GlobalContext';

const Portfolio = () => {
  const { walletAddress, ethersProvider } = useContext(GlobalContext);
  const [ethBalance, setEthBalance] = useState('0');
  const [tokensInWallet, setTokensInWallet] = useState<Token[]>([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [tokensWithPrices, setTokensWithPrices] = useState<{
    [tokenSymbol: string]: number;
  }>({});

  useEffect(() => {
    if (walletAddress && ethersProvider) {
      const getBalance = async () => {
        const balance = await ethersProvider.getBalance(walletAddress);
        setEthBalance(Number(ethers.formatEther(balance)).toFixed(5));
      };
      getBalance();
    }
  }, [walletAddress, ethersProvider]);

  useMemo(() => {
    if (walletAddress) {
      const fetchedTokens = getTokens(walletAddress);
      fetchedTokens.then((tokens) => {
        setTokensInWallet(tokens);
      });
    }
  }, [walletAddress]);

  useMemo(() => {
    if (Number(ethBalance) > 0) {
      const fetchedEthPrice = getEthPrice();
      fetchedEthPrice.then((price) => {
        setEthPrice(price);
      });
    }
  }, [ethBalance]);

  useMemo(() => {
    if (tokensInWallet.length > 0) {
      const fetchedTokenPrices = getTokenPrices(tokensInWallet);
      fetchedTokenPrices.then((prices) => {
        setTokensWithPrices(prices);
      });
    }
  }, [tokensInWallet]);

  return (
    <div className="mt-3 flex flex-col">
      <table className="mt-2 table-fixed">
        <thead>
          <tr>
            <th className="w-2/12 text-left text-xl">Token</th>
            <th className="w-3/12 text-left text-xl">Price</th>
            <th className="w-4/12 text-left text-xl">Balance</th>
            <th className="w-3/12 text-left text-xl">Value</th>
          </tr>
        </thead>
        <tbody className="text-lg">
          <tr>
            <td>ETH</td>
            <td>${ethPrice.toFixed(2)}</td>
            <td>{ethBalance}</td>
            <td>${(Number(ethBalance) * ethPrice).toFixed(2)}</td>
          </tr>
          {tokensInWallet.map((token) => (
            <tr key={token.address}>
              <td className="w-2/12 text-left">{token.symbol}</td>
              <td className="w-3/12 text-left">
                $
                {Number(tokensWithPrices[token.symbol.toLowerCase()]) < 0.001
                  ? '<0.001'
                  : Number(tokensWithPrices[token.symbol.toLowerCase()])
                      .toFixed(3)
                      .replace(/\.?0+$/, '')}
              </td>
              <td className="w-4/12 text-left">
                {Number(ethers.formatEther(token.totalBalance)).toFixed(5)}
              </td>
              <td className="w-3/12 text-left">
                $
                {tokensWithPrices?.[token.symbol.toLowerCase()] !== undefined &&
                  (() => {
                    const tokenPrice =
                      tokensWithPrices?.[token.symbol.toLowerCase()] ?? 0;
                    const totalBalance = Number(
                      ethers.formatEther(token.totalBalance)
                    );
                    const value = totalBalance * tokenPrice;
                    return Number.isNaN(value) ? '-' : value.toFixed(2);
                  })()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
