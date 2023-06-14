// TODO: refactor to add pagination at bottom when allActivity is true, receive page from url params
/* eslint-disable import/no-extraneous-dependencies */
import Link from 'next/link';
import { useContext, useMemo, useState } from 'react';

import getActivity from '@/api/activity';
import type { ActivityItem } from '@/api/types/activityTypes';
import { GlobalContext } from '@/context/GlobalContext';

import ActivitySingle from './ActivitySingle';

type Props = {
  allActivity?: boolean;
};

const ActivitySummary = ({ allActivity }: Props) => {
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
          {!allActivity && (
            <div>
              <Link href="/activity">
                <p className="text-blue-300">View All</p>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ActivitySummary;
