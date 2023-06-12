import { useContext } from 'react';

import Card from '@/components/Card';
import WalletButton from '@/components/WalletButton';
import { GlobalContext } from '@/context/GlobalContext';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  const { walletAddress } = useContext(GlobalContext);

  return (
    <Main
      meta={
        <Meta
          title="Ether Oasis"
          description="Like your AOL homepage, but for Ethereum."
        />
      }
    >
      <div className="flex w-full flex-col items-start justify-start">
        <Card
          title={
            walletAddress && walletAddress !== ''
              ? 'Your wallet'
              : 'No Wallet Connected'
          }
          content={
            walletAddress && walletAddress !== '' ? (
              <div>
                <p>
                  You are currently connected to the Ethereum mainnet with the
                  address:
                </p>
                <p className="font-bold text-gray-900">{walletAddress}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <p>Connect you wallet to continue.</p>
                <WalletButton />
              </div>
            )
          }
          centerContent={!(walletAddress && walletAddress !== '')}
        />
      </div>
    </Main>
  );
};

export default Index;
