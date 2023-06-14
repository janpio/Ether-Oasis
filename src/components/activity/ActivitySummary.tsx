/* eslint-disable import/no-extraneous-dependencies */
import { useContext, useMemo, useState } from 'react';

import getActivity from '@/api/activity';
import type { ActivityItem } from '@/api/types/activityTypes';
import { GlobalContext } from '@/context/GlobalContext';

import ActivitySingle from './ActivitySingle';

const ActivitySummary = () => {
  const { walletAddress } = useContext(GlobalContext);
  const [activityItems, setActivityItems] = useState<ActivityItem[]>([]);

  useMemo(() => {
    if (walletAddress) {
      (async () => {
        const activity = await getActivity(walletAddress, 1);
        setActivityItems(activity);
      })();
    }
  }, [walletAddress]);

  return (
    <div className="mt-3 flex flex-col">
      {activityItems && activityItems.length > 0 && (
        <div className="mt-2">
          {activityItems.slice(0, 12).map((activityItem) => (
            <ActivitySingle
              key={activityItem.transactionHash}
              activityItem={activityItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActivitySummary;
