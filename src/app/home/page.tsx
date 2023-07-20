import { cookies } from 'next/headers';

import { getActivity, getAssetTransfers } from '@/api/activity';
import { getAlchemyTokens, getEthPrice } from '@/api/tokens';
import type { ActivityResponse } from '@/api/types/activityTypes';
import { defaultTransfer } from '@/api/types/activityTypes';
import type { AlchemyToken } from '@/api/types/tokenTypes';
import ActivitySummary from '@/components/activity/ActivitySummary';
import Card from '@/components/Card';
import NameTag from '@/components/NameTag';
import Portfolio from '@/components/Portfolio';
import WalletButton from '@/components/WalletButton';

import DisplayName from './DisplayName';

export default async function Page() {
  const cookieStore = cookies();
  const walletAddress = cookieStore.get('walletAddress')?.value;

  const ethPrice = await getEthPrice();
  let fetchedTokens: AlchemyToken[] = [];
  let activity: ActivityResponse & { activityItems: any[] } = {
    activityItems: [],
    totalPages: 1,
    pageNumber: 1,
  };
  const fetching = false;

  if (walletAddress && walletAddress !== '') {
    fetchedTokens = await getAlchemyTokens(walletAddress);
    const localActivity = await getActivity(walletAddress, 1);

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

    activity = {
      ...localActivity,
      activityItems: activityItemsWithAssetTransfers,
    };
  }

  if (!walletAddress || walletAddress === '') {
    return (
      <div className="flex w-full flex-row">
        <div className="mr-2 flex w-full flex-col items-start justify-start">
          <Card
            title="No Wallet Connected"
            content={
              <div className="flex w-full flex-col items-center justify-center">
                <p className="mb-4 mt-2 text-xl">
                  Connect your wallet to continue.
                </p>
                <WalletButton />
                <p className="mt-4 text-xl">
                  Or, enter a wallet address to impersonate:
                </p>
                {/* 
                  TODO: Bump this form down to client component and handle impersonation there
                  <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    console.log('display name', addressToImpersonate);
                    const ens = await fetchEns(addressToImpersonate);
                    handleUpdate(addressToImpersonate, ens, null);
                  }}
                  className="mt-4 flex w-full flex-row items-center justify-center"
                >
                  <input
                    className="mr-1 h-10 w-3/6 appearance-none rounded border border-blue-300 bg-blue-100 px-3 py-2 leading-tight text-gray-800 shadow"
                    type="text"
                    placeholder="0x..."
                    onChange={(e) => {
                      setAddressToImpersonate(e.target.value);
                    }}
                  />
                  <button
                    className="wallet-button h-10 rounded border border-blue-200 bg-blue-200 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-800 hover:text-blue-200"
                    type="submit"
                  >
                    Impersonate
                  </button>
                </form> */}
              </div>
            }
            centerContent
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <NameTag />
      <div className="flex flex-row">
        <div className="mr-2 flex w-1/2 flex-col items-start justify-start">
          <Card
            title={<DisplayName walletAddress={walletAddress} />}
            content={
              <div>
                <Portfolio
                  tokensInWallet={fetchedTokens}
                  ethPrice={ethPrice}
                  fetching={fetching}
                />
              </div>
            }
            centerContent={!(walletAddress && walletAddress !== '')}
          />
        </div>
        <div className="ml-2 flex w-1/2 flex-col items-start justify-start">
          <Card
            title="Activity"
            content={
              <ActivitySummary
                allActivity={false}
                activity={activity}
                fetching={fetching}
              />
            }
            centerContent={false}
            key={activity.activityItems.length}
          />
        </div>
      </div>
    </div>
  );
}
