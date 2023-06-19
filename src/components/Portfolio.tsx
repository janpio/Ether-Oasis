/* eslint-disable no-console */
// TODO: somehow get token icons to display with ticker
/* eslint-disable import/no-extraneous-dependencies */
import axios from 'axios';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import getTokens from '@/api/tokens';
import type { Token } from '@/api/types/tokenTypes';
import { GlobalContext } from '@/context/GlobalContext';
import coinGeckoData from '@/utils/CoinGeckoList.json';

const Portfolio = () => {
  const { walletAddress, ethersProvider } = useContext(GlobalContext);
  const [ethBalance, setEthBalance] = useState('0');
  const [tokensInWallet, setTokensInWallet] = useState<Token[]>([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [tokensWithPrices, setTokensWithPrices] = useState<{
    [tokenSymbol: string]: number;
  }>({});

  const tokensData = coinGeckoData.tokens;

  const findIdBySymbol = (symbol: string) => {
    const localToken = tokensData.find((token) => token.symbol === symbol);
    return localToken ? localToken.id : '';
  };

  const findSymbolById = (id: string) => {
    const localToken = tokensData.find((token) => token.id === id);
    return localToken ? localToken.symbol : '';
  };

  useEffect(() => {
    if (walletAddress && ethersProvider) {
      const getBalance = async () => {
        const balance = await ethersProvider.getBalance(walletAddress);
        setEthBalance(Number(ethers.formatEther(balance)).toFixed(5));
      };
      getBalance();
    }
  }, [walletAddress, ethersProvider]);

  useEffect(() => {
    if (walletAddress) {
      (async () => {
        const tokens = await getTokens(walletAddress);
        setTokensInWallet(tokens);
      })();
    }
  }, [walletAddress]);

  useEffect(() => {
    const fetchEthPrice = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price',
          {
            params: {
              ids: 'ethereum',
              vs_currencies: 'usd',
            },
          }
        );

        const { data } = response;
        console.log(data);
        setEthPrice(data.ethereum.usd);
      } catch (error) {
        console.error('Error fetching token prices:', error);
      }
    };

    if (Number(ethBalance) > 0) {
      fetchEthPrice();
    }
  }, [ethBalance]);

  useEffect(() => {
    const fetchTokenPrices = async () => {
      const tokenIds = tokensInWallet.map((token) =>
        findIdBySymbol(token.symbol.toLowerCase())
      );

      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/simple/price',
          {
            params: {
              ids: tokenIds.join(),
              vs_currencies: 'usd',
            },
          }
        );

        const { data } = response;

        const updatedTokensWithPrices: { [tokenSymbol: string]: number } = {};

        Object.keys(data).forEach((id) => {
          if (Object.prototype.hasOwnProperty.call(data, id)) {
            const price = data[id].usd;
            updatedTokensWithPrices[findSymbolById(id)] = price;
          }
        });

        console.log(updatedTokensWithPrices);
        if (Object.keys(updatedTokensWithPrices).length > 0) {
          setTokensWithPrices(updatedTokensWithPrices);
        }
      } catch (error) {
        console.error('Error fetching token prices:', error);
      }
    };

    if (tokensInWallet.length > 0) {
      fetchTokenPrices();
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
