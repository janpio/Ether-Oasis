import { useRouter } from 'next/router';

import ActivitySummary from '@/components/activity/ActivitySummary';
import Card from '@/components/Card';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const ActivityPage = () => {
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
        content={<ActivitySummary allActivity pageNumber={Number(page)} />}
        centerContent={false}
      />
    </Main>
  );
};

export default ActivityPage;
