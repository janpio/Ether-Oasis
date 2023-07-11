/* eslint-disable jsx-a11y/mouse-events-have-key-events */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable react/button-has-type */
import coinbaseWalletModule from '@web3-onboard/coinbase';
import Onboard from '@web3-onboard/core';
import injectedModule from '@web3-onboard/injected-wallets';
import walletConnectModule from '@web3-onboard/walletconnect';
import type { JsonRpcProvider } from 'ethers';
import { ethers } from 'ethers';
import Cookies from 'js-cookie';
import { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '@/context/GlobalContext';
import { fetchEns } from '@/utils/fetchEns';
import { truncateString } from '@/utils/truncateString';

const MAINNET_RPC_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY}`;

type WalletConnectOptions = {
  bridge?: string; // default = 'https://bridge.walletconnect.org'
  qrcodeModalOptions?: {
    mobileLinks: string[]; // set the order and list of mobile linking wallets
  };
  connectFirstChainId?: boolean; // if true, connects to the first network chain provided
  /**
   * Optional function to handle WalletConnect URI when it becomes available
   */
  handleUri?: (uri: string) => Promise<unknown>;
} & (
  | {
      /**
       * Defaults to version: 1 - this behavior will be deprecated after the WalletConnect v1 sunset
       */
      version?: 1;
    }
  | {
      /**
       * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
       */
      projectId: string;
      /**
       * Defaults to version: 1 - this behavior will be deprecated after the WalletConnect v1 sunset
       */
      version: 2;
      /**
       * List of Required Chain(s) ID for wallets to support in number format (integer or hex)
       * Defaults to [1] - Ethereum
       * The chains defined within the web3-onboard config will define the
       * optional chains for the WalletConnect module
       */
      requiredChains?: number[] | undefined;
    }
);

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

  const coinbaseWalletSdk = coinbaseWalletModule({ darkMode: true });

  const wcV1InitOptions: WalletConnectOptions = {
    qrcodeModalOptions: {
      mobileLinks: ['metamask', 'argent', 'trust'],
    },
    connectFirstChainId: true,
  };

  // V2 options, disabled for now due to bug in WalletConnect v2, continue checking to see if it gets fixed
  // const wcV2InitOptions: WalletConnectOptions = {
  //   version: 2,
  //   /**
  //    * Project ID associated with [WalletConnect account](https://cloud.walletconnect.com)
  //    */
  //   projectId: 'abc123...',
  //   /**
  //    * Chains required to be supported by all wallets connecting to your DApp
  //    */
  //   requiredChains: [1],
  // };

  // const walletConnect = walletConnectModule(wcV2InitOptions || wcV1InitOptions);

  const walletConnect = walletConnectModule(wcV1InitOptions);

  const loadEns = async (address: string, provider: JsonRpcProvider) => {
    const ens = await fetchEns(address, provider);
    return ens;
  };

  useEffect(() => {
    const storedWalletAddress = Cookies.get('walletAddress');
    const loadProvider = async () => {
      const provider = new ethers.JsonRpcProvider(MAINNET_RPC_URL, 1);
      return provider;
    };
    const setContext = async () => {
      if (storedWalletAddress) {
        const provider = await loadProvider();
        const localEns = await loadEns(storedWalletAddress, provider);
        handleUpdate(storedWalletAddress, localEns, provider);
        setIsConnected(true);
      }
    };

    setContext();
  }, []);

  // useEffect(() => {
  //   if (walletAddress && walletAddress !== '' && ethersProvider) {
  //     loadEns();
  //   }
  // }, [walletAddress, ethersProvider]);

  useEffect(() => {
    if (walletAddress && walletAddress !== '') {
      setIsConnected(true);
      setIsMousingOver(false);
    }
  }, [walletAddress]);

  const injected = injectedModule();

  const onboard = Onboard({
    wallets: [injected, coinbaseWalletSdk, walletConnect],
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
      const localEthersProvider = new ethers.BrowserProvider(
        wallets[0].provider,
        'any'
      );
      const signer = await localEthersProvider.getSigner();
      const ens = await fetchEns(signer.address, localEthersProvider);
      handleUpdate(signer.address, ens, localEthersProvider);
      setIsMousingOver(false);
      setIsConnected(true);
      Cookies.set('walletAddress', signer.address); // Store the wallet address
    }
  };

  const handleDisconnect = async () => {
    const [primaryWallet] = onboard.state.get().wallets;
    if (primaryWallet) {
      await onboard.disconnectWallet({ label: primaryWallet.label });
    }
    handleUpdate('', '', null);
    setIsConnected(false);
    Cookies.remove('walletAddress'); // Remove the stored wallet address
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
