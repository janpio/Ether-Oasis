/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-console */
/* eslint-disable react/button-has-type */
// TODO: Add support for WalletConnect, CoinbaseWallet and a few others supported by Onboard.js
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import { ethers } from 'ethers';
import { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '@/context/GlobalContext';
import { truncateString } from '@/utils/truncateString';

const MAINNET_RPC_URL = process.env.NEXT_PUBLIC_MAINNET_RPC_URL;

const WalletButton = () => {
  const { walletAddress, ensName, updateVariables } = useContext(GlobalContext);
  const [isConnected, setIsConnected] = useState(false); // New state to track connection status
  const [isMousingOver, setIsMousingOver] = useState(false); // New state to track mouseover status

  const handleUpdate = (
    walletAddr: string,
    ens: string,
    provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null
  ) => {
    updateVariables(walletAddr, ens, provider);
  };

  const fetchEns = async (
    address: string,
    provider: ethers.BrowserProvider | ethers.JsonRpcProvider
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

  useEffect(() => {
    const storedWalletAddress = localStorage.getItem('walletAddress');
    if (storedWalletAddress) {
      setIsConnected(true);
      const loadProviderAndENS = async () => {
        const provider = new ethers.JsonRpcProvider(MAINNET_RPC_URL);
        const ens = await fetchEns(storedWalletAddress, provider);
        handleUpdate(storedWalletAddress, ens, provider);
      };
      loadProviderAndENS();
    }
  }, []);

  useEffect(() => {
    if (walletAddress && walletAddress !== '') {
      setIsConnected(true);
      setIsMousingOver(false);
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
      setIsMousingOver(false);
      setIsConnected(true);
      localStorage.setItem('walletAddress', signer.address); // Store the wallet address
    }
  };

  const handleDisconnect = async () => {
    const [primaryWallet] = onboard.state.get().wallets;
    if (primaryWallet) {
      await onboard.disconnectWallet({ label: primaryWallet.label });
    }
    handleUpdate('', '', null);
    setIsConnected(false);
    localStorage.removeItem('walletAddress'); // Remove the stored wallet address
  };

  if (walletAddress !== '') {
    return (
      <div className="relative inline-block">
        <button
          className="wallet-button rounded border border-blue-200 bg-blue-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
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
      className="wallet-button rounded border border-blue-200 bg-blue-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
      onClick={() => connectWallet()}
    >
      Connect Wallet
    </button>
  );
};

export default WalletButton;
