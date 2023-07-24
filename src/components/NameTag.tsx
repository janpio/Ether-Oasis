// eslint-disable-next-line import/no-extraneous-dependencies
import makeBlockie from 'ethereum-blockies-base64';
import Skeleton from 'react-loading-skeleton';

import { truncateString } from '@/utils/truncateString';

import DisplayName from './DisplayName';

type NameTagProps = {
  walletAddress: string;
};

const NameTag = ({ walletAddress }: NameTagProps) => {
  if (!walletAddress || walletAddress === '') {
    return (
      <div className="mb-4 mt-2 flex flex-row items-start justify-start">
        <div className="ml-5">
          <Skeleton circle height={64} width={64} />
        </div>
        <div className="ml-5">
          <p className="-mt-1 text-2xl">
            <Skeleton width={200} />
          </p>
          <p className="mt-1 text-base text-gray-600">
            <Skeleton width={200} />
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-4 mt-2 flex flex-row items-start justify-start">
      <div className="ml-5">
        {walletAddress && walletAddress !== '' && (
          <img
            className="h-16 w-16 rounded-md"
            src={makeBlockie(walletAddress)}
            alt="wallet blockie"
          />
        )}
      </div>
      <div className="ml-5">
        <p className="-mt-1 text-2xl">
          <DisplayName walletAddress={walletAddress} />
        </p>
        <p className="mt-1 text-base text-gray-600">
          {truncateString(walletAddress)}
        </p>
      </div>
    </div>
  );
};

export default NameTag;
