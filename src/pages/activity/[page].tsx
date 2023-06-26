import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { getActivity, getAssetTransfers } from '@/api/activity';
import type { ActivityResponse } from '@/api/types/activityTypes';
import { defaultTransfer } from '@/api/types/activityTypes';
import ActivitySummary from '@/components/activity/ActivitySummary';
import Card from '@/components/Card';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

interface ActivityProps {
  activity: ActivityResponse;
}

const ActivityPage: NextPage<ActivityProps> = ({ activity }: ActivityProps) => {
  const router = useRouter();
  const { page } = router.query;

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
          />
        }
        centerContent={false}
      />
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps<ActivityProps> = async ({
  req,
  query,
}) => {
  const storedWalletAddress = req.cookies.walletAddress as string;
  const { page } = query;
  const pageNumber = Number(page) || 1;

  const activity = await getActivity(storedWalletAddress, pageNumber);
  const { activityItems } = activity;

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
    props: {
      activity: { ...activity, activityItems: activityItemsWithAssetTransfers },
    },
  };
};

export default ActivityPage;
