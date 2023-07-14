/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import type { ethers } from 'ethers';
import type { GetStaticProps, NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';

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
import { GlobalContext } from '@/context/GlobalContext';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';
import { fetchEns } from '@/utils/fetchEns';
import { truncateAddress } from '@/utils/truncateString';

import prisma from '../../lib/prisma';

// type Props = {
//   users: any[];
// };

const Index: NextPage = () => {
  const { walletAddress, ensName, updateVariables } = useContext(GlobalContext);
  const [displayName, setDisplayName] = useState('');
  const [fetchedTokens, setFetchedTokens] = useState<AlchemyToken[]>([]);
  const [ethPrice, setEthPrice] = useState(0);
  const [activity, setActivity] = useState<
    ActivityResponse & { activityItems: any[] }
  >({
    activityItems: [],
    totalPages: 1,
    pageNumber: 1,
  });
  const [fetching, setFetching] = useState(false);
  const [addressToImpersonate, setAddressToImpersonate] = useState('');

  const handleUpdate = (
    walletAddr: string,
    ens: string,
    provider: ethers.BrowserProvider | ethers.JsonRpcProvider | null
  ) => {
    updateVariables(walletAddr, ens, provider);
  };

  // useEffect(() => {
  //   if (users) {
  //     console.log('users', users);
  //   }
  // }, [users]);

  useEffect(() => {
    if (ensName && ensName !== '') {
      setDisplayName(ensName);
    } else if (walletAddress && walletAddress !== '') {
      setDisplayName(truncateAddress(walletAddress));
    } else if (walletAddress === '') {
      setDisplayName('');
    }
  }, [walletAddress, ensName, addressToImpersonate]);

  const fetchPageData = async (address: string) => {
    console.log('fetching page data');
    const localFetchedTokens = await getAlchemyTokens(address);

    const [localEthPrice, localActivity] = await Promise.all([
      getEthPrice(),
      getActivity(address, 1),
    ]);

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
    setFetchedTokens(localFetchedTokens);
    setEthPrice(localEthPrice);
    setActivity({
      ...activity,
      activityItems: activityItemsWithAssetTransfers,
    });
    setFetching(false);
  };

  // if the wallet address changes, re-fetch the page data, do not fetch on initial load
  useEffect(() => {
    if (walletAddress && walletAddress !== '' && !fetching) {
      setFetching(true);
      fetchPageData(walletAddress);
    }
  }, [walletAddress]);

  if (!walletAddress || walletAddress === '') {
    return (
      <Main
        meta={<Meta title="Ether Oasis" description="Trade, Track, Hang." />}
      >
        <NameTag />
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
                  </form>
                </div>
              }
              centerContent
            />
          </div>
        </div>
      </Main>
    );
  }

  return (
    <Main meta={<Meta title="Ether Oasis" description="Trade, Track, Hang." />}>
      <NameTag />
      <div className="flex flex-row">
        <div className="mr-2 flex w-1/2 flex-col items-start justify-start">
          <Card
            title={displayName}
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
    </Main>
  );
};

export default Index;

export const getStaticProps: GetStaticProps = async () => {
  const users = await prisma.user.findMany({
    where: { walletAddress: { not: null } },
  });
  return {
    props: {
      users: JSON.parse(JSON.stringify(users)),
    },
    revalidate: 10,
  };
};
