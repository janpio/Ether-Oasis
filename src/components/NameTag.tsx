// eslint-disable-next-line import/no-extraneous-dependencies
import makeBlockie from 'ethereum-blockies-base64';
import { useContext, useEffect, useState } from 'react';

import { GlobalContext } from '@/context/GlobalContext';
import { truncateString } from '@/utils/truncateString';

const NameTag = () => {
  const { walletAddress, ensName } = useContext(GlobalContext);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (ensName && ensName !== '') {
      setDisplayName(ensName);
    } else if (walletAddress && walletAddress !== '') {
      setDisplayName(walletAddress);
    } else if (walletAddress === '') {
      setDisplayName('No Wallet Connected');
    }
  }, [walletAddress, ensName]);

  return (
    <div className="flex flex-row items-start justify-start">
      <div className="ml-5 flex-col">
        {walletAddress && walletAddress !== '' && (
          <img
            className="h-24 w-24 rounded-md"
            src={makeBlockie(walletAddress)}
            alt="wallet blockie"
          />
        )}
        <p className="mt-1 text-2xl">{displayName}</p>
        {displayName !== walletAddress && (
          <p className="mt-1 text-lg text-gray-600">
            {truncateString(walletAddress)}
          </p>
        )}
      </div>
    </div>
  );
};

export default NameTag;
