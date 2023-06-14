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
            <th className="w-1/2 text-left text-xl">Token</th>
            <th className="w-1/2 text-left text-xl">Balance</th>
          </tr>
        </thead>
        <tbody className="text-lg">
          <tr>
            <td>ETH</td>
            <td>{ethBalance}</td>
          </tr>
          {tokensInWallet.map((token) => (
            <tr key={token.address}>
              <td>{token.symbol}</td>
              <td>
                {Number(ethers.formatEther(token.totalBalance)).toFixed(5)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Portfolio;
