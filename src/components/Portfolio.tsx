/* eslint-disable tailwindcss/no-custom-classname */
import { ethers } from 'ethers';
import React, { useContext, useEffect, useMemo, useState } from 'react';

import {
  getEthPrice,
  getTokenImage,
  getTokenPrices,
  getTokens,
} from '@/api/tokens';
import type { Token } from '@/api/types/tokenTypes';
import { GlobalContext } from '@/context/GlobalContext';

import PortfolioRow from './PortfolioRow';

const Portfolio = () => {
  const { walletAddress, ethersProvider } = useContext(GlobalContext);
  const [ethBalance, setEthBalance] = useState('0');
  const [tokensInWallet, setTokensInWallet] = useState<Token[]>([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [tokensWithPrices, setTokensWithPrices] = useState<{
    [tokenSymbol: string]: number;
  }>({ '': 0 });
  const [totalValue, setTotalValue] = useState(0);
  const [ethImage, setEthImage] = useState<string>('');

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
      const fetchedEthImage = getTokenImage('ETH');
      fetchedEthImage.then((image) => {
        setEthImage(image);
      });
    }
  }, [walletAddress]);

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

  useMemo(() => {
    const calculateTotalValue = () => {
      const ethBalanceValue = Number(ethBalance) * ethPrice;
      const tokenValue = tokensInWallet.reduce(
        (total, token) =>
          total +
          (tokensWithPrices[token.symbol.toLowerCase()] ?? 0) *
            Number(ethers.formatEther(token.totalBalance)),
        0
      );
      return ethBalanceValue + tokenValue;
    };

    setTotalValue(calculateTotalValue());
  }, [ethBalance, ethPrice, tokensWithPrices, tokensInWallet]);

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
          <tr className="border-b border-gray-700">
            <td>
              <img
                className="-mt-1 mr-2 inline-block h-6 w-6 rounded-full"
                src={ethImage}
                alt="ETH"
              />
              ETH
            </td>
            <td>${ethPrice.toFixed(2)}</td>
            <td>{ethBalance}</td>
            <td className="text-right">
              ${(Number(ethBalance) * ethPrice).toFixed(2)}
            </td>
          </tr>
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
