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
  const { walletAddress, ensName, updateVariables } = useContext(GlobalContext);

  const handleUpdate = (
    walletAddr: string,
    ens: string,
    provider: ethers.BrowserProvider | null
  ) => {
    updateVariables(walletAddr, ens, provider);
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

  const fetchEns = async (
    address: string,
    provider: ethers.BrowserProvider
  ) => {
    if (address && provider) {
      const localEnsName = await provider.lookupAddress(address);
      if (localEnsName) {
        const truncatedEns =
          localEnsName.substring(0, localEnsName.indexOf('.')).slice(0, 20) +
          localEnsName.substring(localEnsName.indexOf('.'));
        return truncatedEns;
      }
      return '';
    }
    return '';
  };

  const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets[0]) {
      console.log(wallets[0]);
      // create an ethers provider with the last connected wallet provider
      // if using ethers v6 this is:
      // ethersProvider = new ethers.BrowserProvider(wallet.provider, 'any')
      const localEthersProvider = new ethers.BrowserProvider(
        wallets[0].provider,
        'any'
      );
      const signer = await localEthersProvider.getSigner();
      const ens = await fetchEns(signer.address, localEthersProvider);
      handleUpdate(signer.address, ens, localEthersProvider);
      console.log(signer);
    }
  };

  if (walletAddress !== '') {
    return (
      <button className="rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white">
        {ensName === '' ? truncateString(walletAddress) : ensName}
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
