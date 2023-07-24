import ActivitySummary from '@/components/activity/ActivitySummary';
import Card from '@/components/Card';

export const metadata = {
  title: 'On Chain Activity',
  description: 'A summary of all on chain activity for this wallet',
};

export default function Loading() {
  return (
    <section>
      <Card
        title="Activity"
        content={<ActivitySummary allActivity fetching />}
        centerContent={false}
      />
    </section>
  );
}
