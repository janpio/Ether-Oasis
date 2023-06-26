import type { GetServerSideProps, NextPage } from 'next';
import { useRouter } from 'next/router';

import { getActivity } from '@/api/activity';
import type { ActivityResponse } from '@/api/types/activityTypes';
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
  const pageNumber = Number(page) || 1; // Convert the page number to a number (default to 1 if not provided or invalid)

  const activity = await getActivity(storedWalletAddress, pageNumber);

  return {
    props: {
      activity,
    },
  };
};

export default ActivityPage;
