/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '@/context/GlobalContext';

const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;

const WalletButton = () => {
  const { walletAddress, ensName, updateVariables } = useContext(GlobalContext);
  const [isConnected, setIsConnected] = useState(false); // New state to track connection status
  const [isMousingOver, setIsMousingOver] = useState(false); // New state to track mouseover status

  const handleUpdate = (
    walletAddr: string,
    ens: string,
    provider: ethers.BrowserProvider | null
  ) => {
    updateVariables(walletAddr, ens, provider);
  };

  useEffect(() => {
    if (walletAddress !== '') {
      setIsConnected(true);
    }
  }, [walletAddress]);

  const injected = injectedModule();

  const onboard = Onboard({
    wallets: [injected],
    accountCenter: {
      desktop: {
        position: 'topRight',
        enabled: false,
      },
      mobile: {
        position: 'topRight',
        enabled: false,
      },
    },
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

  const buttonTextFiller = () => {
    if (isConnected && isMousingOver === true) {
      return 'Disconnect';
    }
    if (ensName === '' && isMousingOver === false) {
      return truncateString(walletAddress);
    }
    return ensName;
  };

  const connectWallet = async () => {
    const wallets = await onboard.connectWallet();
    if (wallets[0]) {
      console.log(wallets[0]);
      const localEthersProvider = new ethers.BrowserProvider(
        wallets[0].provider,
        'any'
      );
      const signer = await localEthersProvider.getSigner();
      const ens = await fetchEns(signer.address, localEthersProvider);
      handleUpdate(signer.address, ens, localEthersProvider);
      console.log(signer);
      setIsMousingOver(false); // Reset mouseover status
      setIsConnected(true); // Update connection status
    }
  };

  const handleDisconnect = async () => {
    const [primaryWallet] = onboard.state.get().wallets;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    primaryWallet &&
      (await onboard.disconnectWallet({ label: primaryWallet.label }));
    handleUpdate('', '', null); // Clear the wallet variables
    setIsConnected(false); // Update connection status
  };

  if (walletAddress !== '') {
    return (
      <div className="relative inline-block">
        <button
          className="wallet-button rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
          onClick={() => handleDisconnect()}
          onMouseEnter={() => setIsMousingOver(true)}
          onMouseLeave={() => setIsMousingOver(false)}
        >
          {buttonTextFiller()}
        </button>
      </div>
    );
  }

  return (
    <button
      className="wallet-button rounded border border-blue-500 bg-transparent px-4 py-2 font-semibold text-blue-700 hover:border-transparent hover:bg-blue-500 hover:text-white"
      onClick={() => connectWallet()}
    >
      Connect Wallet
    </button>
  );
};

export default WalletButton;
