import type { ReactNode } from 'react';
import React, { createContext, useMemo, useState } from 'react';

// Define the shape of your global context
interface GlobalContextType {
  walletAddress: string;
  updateVariables: (walletAddr: string) => void;
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

  // Define the function to update the variables
  const updateVariables = (walletAddr: string) => {
    setWalletAddress(walletAddr);
  };

  // Provide the context value to its children
  const contextValue: GlobalContextType = useMemo(() => {
    return {
      walletAddress,
      updateVariables,
    };
  }, [walletAddress, updateVariables]);

  return (
    <GlobalContext.Provider value={contextValue}>
      {children}
    </GlobalContext.Provider>
  );
};
