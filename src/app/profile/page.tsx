import { cookies } from 'next/headers';

import Card from '@/components/Card';
import NameTag from '@/components/NameTag';
import WalletButton from '@/components/WalletButton';

export const metadata = {
  title: 'My Profile',
  description: 'Manage your EtherOasis Profile.',
};

const Profile = () => {
  const cookieStore = cookies();
  const walletAddress = cookieStore.get('walletAddress')?.value;

  if (!walletAddress || walletAddress === '') {
    return (
      <div className="flex w-full flex-row">
        <div className="mr-2 flex w-full flex-col items-start justify-start">
          <Card
            centerContent
            title="No Wallet Connected"
            content={
              <div className="flex w-full flex-col items-center justify-center">
                <div className="flex w-full flex-row items-center justify-center">
                  <WalletButton />
                </div>
              </div>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <section>
      <NameTag walletAddress={walletAddress} />
      <h2>
        <span className="text-2xl font-bold">My Profile</span>
      </h2>
    </section>
  );
};

export default Profile;
