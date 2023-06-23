/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import makeBlockie from 'ethereum-blockies-base64';
import { useContext, useEffect, useState } from 'react';
import { format } from 'timeago.js';

import { getAssetTransfers } from '@/api/activity';
import type { ActivityItem, Transfer } from '@/api/types/activityTypes';
import { defaultTransfer } from '@/api/types/activityTypes';
import { GlobalContext } from '@/context/GlobalContext';

type Props = {
  activityItem: ActivityItem;
};

const ActivitySingle = ({ activityItem }: Props) => {
  const { walletAddress, ensName } = useContext(GlobalContext);
  const [assetTransfers, setAssetTransfers] = useState<Transfer[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAssetTransfers = await getAssetTransfers(activityItem);
      setAssetTransfers([...fetchedAssetTransfers]);
    };

    fetchData();
  }, [activityItem]);

  return (
    <div className="mt-4 flex flex-col rounded border border-blue-300 p-3">
      <div className="flex w-full flex-row items-center">
        {walletAddress && walletAddress !== '' && (
          <img
            className="h-12 w-12 rounded-md"
            src={makeBlockie(walletAddress)}
            alt="wallet blockie"
          />
        )}
        <div className="ml-4 flex flex-col items-start justify-start">
          <p className="text-lg font-bold">
            {ensName && ensName !== '' ? ensName : walletAddress}
          </p>
          <p>{format(activityItem.blockTimestamp)}</p>
        </div>
      </div>
      <p className="mt-2">did something with: {activityItem.toAddress}</p>
      {assetTransfers && assetTransfers[0] !== defaultTransfer && (
        <div className="flex flex-row items-start justify-start">
          {assetTransfers.map((transfer) => (
            <div
              key={transfer.uniqueId}
              className="mr-2 mt-2 flex flex-row items-start justify-start"
            >
              <p className="rounded border border-gray-600 px-2 py-1">
                {transfer.asset}: {transfer.value?.toFixed(2)}{' '}
                <span>
                  {transfer.to.toLocaleLowerCase() ===
                  walletAddress?.toLocaleLowerCase()
                    ? 'IN'
                    : 'OUT'}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitySingle;
