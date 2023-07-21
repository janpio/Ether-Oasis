/* eslint-disable no-console */
import { cookies } from 'next/headers';

import { getActivity, getAssetTransfers } from '@/api/activity';
import { defaultTransfer } from '@/api/types/activityTypes';
import ActivitySummary from '@/components/activity/ActivitySummary';
import Card from '@/components/Card';

export const metadata = {
  title: 'On Chain Activity',
  description: 'A summary of all on chain activity for this wallet',
};

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
  return {
    ...localActivity,
    activityItems: activityItemsWithAssetTransfers,
  };
};

export default async function Page({ params }: { params: { page: string } }) {
  const cookieStore = cookies();
  const walletAddress = cookieStore.get('walletAddress')?.value;
  let activity;

  if (walletAddress && walletAddress !== '') {
    activity = await fetchPageData(walletAddress, params.page);
  } else {
    activity = {
      activityItems: [],
      totalPages: 1,
      pageNumber: 1,
    };
  }

  return (
    <section>
      <Card
        title="Activity"
        content={
          <ActivitySummary
            allActivity
            pageNumber={Number(params.page)}
            activity={activity}
            fetching={false}
          />
        }
        centerContent={false}
      />
    </section>
  );
}
