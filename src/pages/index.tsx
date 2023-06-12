import { useContext, useEffect, useState } from 'react';

import Card from '@/components/Card';
import Portfolio from '@/components/Portfolio';
import WalletButton from '@/components/WalletButton';
import { GlobalContext } from '@/context/GlobalContext';
import { Meta } from '@/layouts/Meta';
import { Main } from '@/templates/Main';

const Index = () => {
  const { walletAddress, ensName } = useContext(GlobalContext);
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (ensName && ensName !== '') {
      setDisplayName(ensName);
    } else if (walletAddress && walletAddress !== '') {
      setDisplayName(walletAddress);
    }
  }, [walletAddress, ensName]);

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
            displayName && displayName !== ''
              ? displayName
              : 'No Wallet Connected'
          }
          content={
            walletAddress && walletAddress !== '' ? (
              <div>
                <Portfolio />
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
