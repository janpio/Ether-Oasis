'use client';

import type { ethers } from 'ethers';
import type { ReactNode } from 'react';
import React, { createContext, useMemo, useState } from 'react';

// Define the shape of your global context
interface GlobalContextType {
  walletAddress: string;
  ensName: string;
  ethersProvider: ethers.BrowserProvider | ethers.JsonRpcProvider | null;
  updateVariables: (
    walletAddr: string,
    ensName: string,
    ethersProvider: ethers.BrowserProvider | ethers.JsonRpcProvider | null
  ) => void;
}

// Create the global context
export const GlobalContext = createContext<GlobalContextType>(
  {} as GlobalContextType
);

// Create a provider component to wrap your app with the global context
export const GlobalContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [ensName, setEnsName] = useState<string>('');
  const [ethersProvider, setEthersProvider] = useState<
    ethers.BrowserProvider | ethers.JsonRpcProvider | null
  >(null);

  // Define the function to update the variables
  const updateVariables = (
    walletAddr: string,
    ens: string,
    provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null
  ) => {
    setWalletAddress(walletAddr);
    setEnsName(ens);
    setEthersProvider(provider);
  };

  // Provide the context value to its children
  const contextValue: GlobalContextType = useMemo(() => {
    return {
      walletAddress,
      ensName,
      ethersProvider,
      updateVariables,
    };
  }, [walletAddress, updateVariables]);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
