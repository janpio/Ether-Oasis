// eslint-disable-next-line import/no-extraneous-dependencies
import makeBlockie from 'ethereum-blockies-base64';

import { truncateString } from '@/utils/truncateString';

import DisplayName from './DisplayName';

type NameTagProps = {
  walletAddress: string;
};

const NameTag = ({ walletAddress }: NameTagProps) => {
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
