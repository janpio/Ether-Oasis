import { cookies } from 'next/headers';

import ActivitySummary from '@/components/activity/ActivitySummary';
import Card from '@/components/Card';
import DisplayName from '@/components/DisplayName';
import NameTag from '@/components/NameTag';
import Portfolio from '@/components/Portfolio';

export default function Loading() {
  const cookieStore = cookies();
  const walletAddress = cookieStore.get('walletAddress')?.value;

  if (!walletAddress || walletAddress === '') {
    return (
      <div>
        <NameTag walletAddress="" />
        <div className="flex flex-row">
          <div className="mr-2 flex w-1/2 flex-col items-start justify-start">
            <Card
              title={<DisplayName walletAddress="" />}
              content={
                <div>
                  <Portfolio tokensInWallet={[]} ethPrice={0} fetching />
                </div>
              }
              centerContent={false}
            />
          </div>
          <div className="ml-2 flex w-1/2 flex-col items-start justify-start">
            <Card
              title="Activity"
              content={<ActivitySummary allActivity={false} fetching />}
              centerContent={false}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NameTag walletAddress={walletAddress} />
      <div className="flex flex-row">
        <div className="mr-2 flex w-1/2 flex-col items-start justify-start">
          <Card
            title={<DisplayName walletAddress={walletAddress} />}
            content={
              <div>
                <Portfolio tokensInWallet={[]} fetching ethPrice={0} />
              </div>
            }
            centerContent={!(walletAddress && walletAddress !== '')}
          />
        </div>
        <div className="ml-2 flex w-1/2 flex-col items-start justify-start">
          <Card
            title="Activity"
            content={<ActivitySummary allActivity={false} fetching />}
            centerContent={false}
          />
        </div>
      </div>
    </div>
  );
}
