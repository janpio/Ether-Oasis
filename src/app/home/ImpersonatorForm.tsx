/* eslint-disable no-console */

'use client';

import type { ethers } from 'ethers';
import Cookies from 'js-cookie';
import { useContext, useState } from 'react';

import { GlobalContext } from '@/context/GlobalContext';
import { fetchEns } from '@/utils/fetchEns';

export default function ImpersonatorForm() {
  const { updateVariables } = useContext(GlobalContext);
  const [addressToImpersonate, setAddressToImpersonate] = useState('');

  const handleUpdate = (
    walletAddr: string,
    ens: string,
    provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null
  ) => {
    Cookies.set('walletAddress', walletAddr);
    updateVariables(walletAddr, ens, provider);
  };

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        console.log('display name', addressToImpersonate);
        const ens = await fetchEns(addressToImpersonate);
        handleUpdate(addressToImpersonate, ens, null);
      }}
      className="mt-4 flex w-full flex-row items-center justify-center"
    >
      <input
        className="mr-1 h-10 w-3/6 appearance-none rounded border border-blue-300 bg-blue-100 px-3 py-2 leading-tight text-gray-800 shadow"
        type="text"
        placeholder="0x..."
        onChange={(e) => {
          setAddressToImpersonate(e.target.value);
        }}
      />
      <button
        className="wallet-button h-10 rounded border border-blue-200 bg-blue-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
        type="submit"
      >
        Impersonate
      </button>
    </form>
  );
}
