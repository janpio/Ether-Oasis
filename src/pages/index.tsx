/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import type { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';

import { getActivity, getAssetTransfers } from '@/api/activity';
import {
  getEthPrice,
  getTokenImage,
  getTokenPrices,
  getTokens,
} from '@/api/tokens';
import type { ActivityResponse } from '@/api/types/activityTypes';
import { defaultTransfer } from '@/api/types/activityTypes';
import type { Token } from '@/api/types/tokenTypes';
import ActivitySummary from '@/components/activity/ActivitySummary';
import Card from '@/components/Card';
import NameTag from '@/components/NameTag';
import Portfolio from '@/components/Portfolio';
import WalletButton from '@/components/WalletButton';
import { GlobalContext } from '@/context/GlobalContext';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

interface IndexProps {
  fetchedTokens: Token[];
  tokensWithPrices: { [tokenSymbol: string]: number };
  ethPrice: number;
  ethImage: string;
  activity: ActivityResponse;
}

const Index: NextPage<IndexProps> = () => {
  const { walletAddress, ensName } = useContext(GlobalContext);
  const [displayName, setDisplayName] = useState('');
  const [fetchedTokens, setFetchedTokens] = useState<Token[]>([]);
  const [tokensWithPrices, setTokensWithPrices] = useState({});
  const [ethPrice, setEthPrice] = useState(0);
  const [ethImage, setEthImage] = useState('');
  const [activity, setActivity] = useState<
    ActivityResponse & { activityItems: any[] }
  >({
    activityItems: [],
    totalPages: 1,
    pageNumber: 1,
  });
  const [fetching, setFetching] = useState(false);

  useEffect(() => {
    if (ensName && ensName !== '') {
      setDisplayName(ensName);
    } else if (walletAddress && walletAddress !== '') {
      setDisplayName(walletAddress);
    } else if (walletAddress === '') {
      setDisplayName('');
    }
  }, [walletAddress, ensName]);

  const fetchPageData = async (address: string) => {
    console.log('fetching page data');
    let localFetchedTokens = await getTokens(address);

    if (localFetchedTokens.length > 0) {
      const updatedTokens = localFetchedTokens.map(async (token) => {
        const image = await getTokenImage(token.symbol);
        return { ...token, image };
      });
      const updatedTokensWithImages = await Promise.all(updatedTokens);
      localFetchedTokens = updatedTokensWithImages;
    }

    const [localTokensWithPrices, localEthPrice, localEthImage, localActivity] =
      await Promise.all([
        getTokenPrices(localFetchedTokens),
        getEthPrice(),
        getTokenImage('ETH'),
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
    setTokensWithPrices(localTokensWithPrices);
    setEthPrice(localEthPrice);
    setEthImage(localEthImage);
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
        <div className="flex flex-row">
          <div className="mr-2 flex w-full flex-col items-start justify-start">
            <Card
              title="No Wallet Connected"
              content={
                <div className="flex flex-col items-center justify-center">
                  <p className="mb-4 mt-2">Connect your wallet to continue.</p>
                  <WalletButton />
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
                  tokensWithPrices={tokensWithPrices}
                  ethPrice={ethPrice}
                  ethImage={ethImage}
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
