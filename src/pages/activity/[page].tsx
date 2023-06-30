/* eslint-disable no-console */
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useContext, useEffect, useState } from 'react';

import { getActivity, getAssetTransfers } from '@/api/activity';
import type { ActivityItem, ActivityResponse } from '@/api/types/activityTypes';
import { defaultTransfer } from '@/api/types/activityTypes';
import ActivitySummary from '@/components/activity/ActivitySummary';
import Card from '@/components/Card';
import { GlobalContext } from '@/context/GlobalContext';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const ActivityPage: NextPage = () => {
  const { walletAddress } = useContext(GlobalContext);
  const router = useRouter();
  const { page } = router.query;
  const [activity, setActivity] = useState<
    ActivityResponse & { activityItems: ActivityItem[] }
  >({
    activityItems: [],
    totalPages: 1,
    pageNumber: 1,
  });
  const [fetching, setFetching] = useState(false);

  const fetchPageData = async (address: string, currentPage: string) => {
    console.log('fetching page data');
    const pageNumber = Number(currentPage) || 1;

    const localActivity = await getActivity(address, pageNumber);
    const { activityItems } = localActivity;

    // Fetch asset transfers for each activity item asynchronously using Promise.all
    const activityItemsWithAssetTransfers = await Promise.all(
      activityItems.map(async (activityItem) => {
        const assetTransfers = await getAssetTransfers(activityItem);
        if (assetTransfers[0] !== defaultTransfer) {
          return { ...activityItem, assetTransfers };
        }
        return activityItem;
      })
    );
    setActivity({
      ...localActivity,
      activityItems: activityItemsWithAssetTransfers,
    });
    setFetching(false);
  };

  useEffect(() => {
    if (walletAddress && walletAddress !== '' && !fetching) {
      setFetching(true);
      fetchPageData(walletAddress, page as string);
    }
  }, [walletAddress, page]);

  return (
    <Main
      meta={
        <Meta
          title="On Chain Activity"
          description="A summary of all on chain activity for this wallet"
        />
      }
    >
      <Card
        title="Activity"
        content={
          <ActivitySummary
            allActivity
            pageNumber={Number(page)}
            activity={activity}
            fetching={fetching}
          />
        }
        centerContent={false}
      />
    </Main>
  );
};

export default ActivityPage;
