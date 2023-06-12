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
    <div>
      <h3>Portfolio</h3>
      <p>{ethBalance} ETH</p>
      <ul>
        {tokensInWallet.map((token) => (
          <li key={token.address}>
            {token.symbol}{' '}
            {Number(ethers.formatEther(token.totalBalance)).toFixed(5)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Portfolio;
