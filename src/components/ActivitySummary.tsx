/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useEffect, useState } from 'react';

import getActivity from '@/api/activity';
import type { ActivityItem } from '@/api/types/activityTypes';
import { GlobalContext } from '@/context/GlobalContext';

const ActivitySummary = () => {
  const { walletAddress, ensName } = useContext(GlobalContext);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);

  useEffect(() => {
    if (walletAddress) {
      (async () => {
        const activity = await getActivity(walletAddress);
        setActivityItems(activity);
      })();
    }
  }, [walletAddress]);

  return (
    <div className="mt-3 flex flex-col">
      {activityItems && activityItems.length > 0 && (
        <div className="mt-2">
          {activityItems.map((activityItem) => (
            <div key={activityItem.transactionHash} className="flex flex-row">
              <p className="mr-2">
                {ensName && ensName !== '' ? ensName : walletAddress} did
                something with: {activityItem.toAddress} on this date and time:{' '}
                {activityItem.blockTimestamp}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitySummary;
