import { cookies } from 'next/headers';

import Card from '@/components/Card';
import NameTag from '@/components/NameTag';
import Profile from '@/components/profile/Profile';
import WalletButton from '@/components/WalletButton';

export const metadata = {
  title: 'My Profile',
  description: 'Manage your EtherOasis Profile.',
};

const ProfilePage = () => {
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
                <div className="mt-5 flex w-full flex-col items-center justify-center">
                  <p className="mb-5 text-xl">
                    Please connect your wallet to view your profile and manage
                    your account.
                  </p>
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
      <Profile />
    </section>
  );
};

export default ProfilePage;
