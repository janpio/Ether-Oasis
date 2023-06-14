/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import getTokens from '@/api/tokens';
import type { Token } from '@/api/types/tokenTypes';
import { GlobalContext } from '@/context/GlobalContext';

const Portfolio = () => {
  const { walletAddress, ethersProvider } = useContext(GlobalContext);
  const [ethBalance, setEthBalance] = useState('0');
  const [tokensInWallet, setTokensInWallet] = useState<Token[]>([]);

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
            <td>$1,650</td>
            <td>{ethBalance}</td>
            <td>${(Number(ethBalance) * 1650).toFixed(2)}</td>
          </tr>
          {tokensInWallet.map((token) => (
            <tr key={token.address}>
              <td className="w-2/12 text-left">{token.symbol}</td>
              <td className="w-3/12 text-left">$69.69</td>
              <td className="w-4/12 text-left">
                {Number(ethers.formatEther(token.totalBalance)).toFixed(5)}
              </td>
              <td className="w-3/12 text-left">$1,420.69</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
