import type { GetServerSideProps, NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';

import {
  getEthPrice,
  getTokenImage,
  getTokenPrices,
  getTokens,
} from '@/api/tokens';
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
}

const Index: NextPage<IndexProps> = ({
  fetchedTokens,
  tokensWithPrices,
  ethPrice,
  ethImage,
}) => {
  const { walletAddress, ensName } = useContext(GlobalContext);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (ensName && ensName !== '') {
      setDisplayName(ensName);
    } else if (walletAddress && walletAddress !== '') {
      setDisplayName(walletAddress);
    } else if (walletAddress === '') {
      setDisplayName('');
    }
  }, [walletAddress, ensName]);

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

  if (!fetchedTokens) {
    return (
      <Main
        meta={<Meta title="Ether Oasis" description="Trade, Track, Hang." />}
      >
        <NameTag />
        <div className="flex flex-row">
          <div className="mr-2 flex w-full flex-col items-start justify-start">
            <Card
              title="No Tokens Fetched from Server :("
              content={
                <div className="flex flex-col items-center justify-center">
                  <p className="mb-4 mt-2">Be Patient.</p>
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
            content={<ActivitySummary allActivity={false} />}
            centerContent={false}
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
      const tokens = await getTokens(address); // Await the promise returned by getTokens
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
      },
    };
  }

  try {
    const fetchedTokens = await fetchTokens(storedWalletAddress);
    const tokensWithPrices = await getTokenPrices(fetchedTokens);
    const ethPrice = await getEthPrice();
    const ethImage = await getTokenImage('ETH');

    return {
      props: {
        fetchedTokens,
        tokensWithPrices,
        ethPrice,
        ethImage,
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
      },
    };
  }
};
export default Index;
