/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import type { GetServerSideProps, NextPage } from 'next';
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

const Index: NextPage<IndexProps> = (initialProps) => {
  const { walletAddress, ensName } = useContext(GlobalContext);
  const [displayName, setDisplayName] = useState('');
  const [fetchedTokens, setFetchedTokens] = useState(
    initialProps.fetchedTokens
  );
  const [tokensWithPrices, setTokensWithPrices] = useState(
    initialProps.tokensWithPrices
  );
  const [ethPrice, setEthPrice] = useState(initialProps.ethPrice);
  const [ethImage, setEthImage] = useState(initialProps.ethImage);
  const [activity, setActivity] = useState(initialProps.activity);

  useEffect(() => {
    if (ensName && ensName !== '') {
      setDisplayName(ensName);
    } else if (walletAddress && walletAddress !== '') {
      setDisplayName(walletAddress);
    } else if (walletAddress === '') {
      setDisplayName('');
    }
  }, [walletAddress, ensName]);

  const reFetchPageData = async (address: string) => {
    console.log('refetching page data');
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
  };

  // if the wallet address changes, re-fetch the page data, do not fetch on initial load
  useEffect(() => {
    if (
      walletAddress &&
      walletAddress !== '' &&
      initialProps.fetchedTokens.length === 0
    ) {
      reFetchPageData(walletAddress);
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
              <ActivitySummary allActivity={false} activity={activity} />
            }
            centerContent={false}
            key={activity.activityItems.length}
          />
        </div>
      </div>
    </Main>
  );
};

export const getServerSideProps: GetServerSideProps<IndexProps> = async ({
  req,
}) => {
  const storedWalletAddress = req.cookies.walletAddress as string;

  const fetchTokens = async (address: string): Promise<Token[]> => {
    if (address && address !== '') {
      const tokens = await getTokens(address);
      return tokens;
    }
    return [];
  };

  if (!storedWalletAddress || storedWalletAddress === '') {
    return {
      props: {
        fetchedTokens: [],
        tokensWithPrices: {},
        ethPrice: 0,
        ethImage: '',
        activity: {
          activityItems: [],
          totalPages: 1,
          pageNumber: 1,
        },
      },
    };
  }

  try {
    const fetchedTokens = await fetchTokens(storedWalletAddress);
    const tokensWithPrices = await getTokenPrices(fetchedTokens);
    const ethPrice = await getEthPrice();
    const ethImage = await getTokenImage('ETH');
    const activity: ActivityResponse = await getActivity(
      storedWalletAddress,
      1
    );

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

    if (fetchedTokens.length > 0) {
      const updatedTokens = fetchedTokens.map(async (token) => {
        const image = await getTokenImage(token.symbol);
        return { ...token, image };
      });
      const updatedTokensWithImages = await Promise.all(updatedTokens);

      return {
        props: {
          fetchedTokens: updatedTokensWithImages,
          tokensWithPrices,
          ethPrice,
          ethImage,
          activity: {
            ...activity,
            activityItems: activityItemsWithAssetTransfers,
          },
        },
      };
    }

    return {
      props: {
        fetchedTokens,
        tokensWithPrices,
        ethPrice,
        ethImage,
        activity: {
          ...activity,
          activityItems: activityItemsWithAssetTransfers,
        },
      },
    };
  } catch (error) {
    console.error('Error fetching tokens:', error);
    return {
      props: {
        fetchedTokens: [],
        tokensWithPrices: {},
        ethPrice: 0,
        ethImage: '',
        activity: {
          activityItems: [],
          totalPages: 1,
          pageNumber: 1,
        },
      },
    };
  }
};

export default Index;
