/* eslint-disable import/no-extraneous-dependencies */
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '@/context/GlobalContext';

const Portfolio = () => {
  const { walletAddress, ethersProvider } = useContext(GlobalContext);
  const [ethBalance, setEthBalance] = useState('0');

  useEffect(() => {
    if (walletAddress && ethersProvider) {
      const getBalance = async () => {
        const balance = await ethersProvider.getBalance(walletAddress);
        setEthBalance(Number(ethers.formatEther(balance)).toFixed(5));
      };
      getBalance();
    }
  }, [walletAddress, ethersProvider]);

  return (
    <div>
      <h3>Portfolio</h3>
      <p>{ethBalance} ETH</p>
    </div>
  );
};

export default Portfolio;
