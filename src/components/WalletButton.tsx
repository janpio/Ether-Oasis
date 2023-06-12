/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';
import { useContext } from 'react';

import { GlobalContext } from '@/context/GlobalContext';

const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;

const WalletButton = () => {
  const { walletAddress, updateVariables } = useContext(GlobalContext);

  const handleUpdate = (walletAddr: string) => {
    updateVariables(walletAddr);
  };

  const injected = injectedModule();

  const onboard = Onboard({
    wallets: [injected],
    chains: [
      {
        id: '0x1',
        token: 'ETH',
        label: 'Ethereum Mainnet',
        rpcUrl: MAINNET_RPC_URL,
      },
    ],
  });

  const truncateString = (str: string) => {
    if (str.length <= 8) {
      return str;
    }
    const firstFour = str.slice(0, 4);
    const lastFour = str.slice(-4);
    return `${firstFour}...${lastFour}`;
  };

  const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets[0]) {
      console.log(wallets[0]);
      // create an ethers provider with the last connected wallet provider
      // if using ethers v6 this is:
      // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
      const ethersProvider = new ethers.BrowserProvider(
        wallets[0].provider,
        'any'
      );
      const signer = await ethersProvider.getSigner();
      handleUpdate(signer.address);
      console.log(signer);
      // send a transaction with the ethers provider
      // const txn = await signer.sendTransaction({
      //   to: '0x',
      //   value: 100000000000000
      // })
      // const receipt = await txn.wait()
      // console.log(receipt)
    }
  };

  if (walletAddress !== '') {
    return (
      <button className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white">
        {truncateString(walletAddress)}
      </button>
    );
  }

  return (
    <button
      className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
      onClick={() => connectWallet()}
    >
      Connect Wallet
    </button>
  );
};

export default WalletButton;
