'use client';

import { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '@/context/GlobalContext';
import { truncateAddress } from '@/utils/truncateString';

type DisplayNameProps = {
  walletAddress: string;
};

export default function DisplayName({ walletAddress }: DisplayNameProps) {
  const { ensName } = useContext(GlobalContext);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (ensName && ensName !== '') {
      setDisplayName(ensName);
    } else if (walletAddress && walletAddress !== '') {
      setDisplayName(truncateAddress(walletAddress));
    } else if (walletAddress === '') {
      setDisplayName('');
    }
  }, [walletAddress, ensName]);

  return <span>{displayName}</span>;
}
