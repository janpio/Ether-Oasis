/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
import makeBlockie from 'ethereum-blockies-base64';
import { useContext } from 'react';
import { format } from 'timeago.js';

// import {
//   fetchTransactionDetails,
//   getContractInteraction,
// } from '@/api/activity';
import type { ActivityItem } from '@/api/types/activityTypes';
import { GlobalContext } from '@/context/GlobalContext';

type Props = {
  activityItem: ActivityItem;
};

const ActivitySingle = ({ activityItem }: Props) => {
  const { walletAddress, ensName } = useContext(GlobalContext);
  // const [transactionDetails, setTransactionDetails] = useState<any>([]);
  // const [contractInteraction, setContractInteraction] = useState<any>({});

  // useMemo(() => {
  //   (async () => {
  //     const details = await fetchTransactionDetails([
  //       activityItem.transactionHash,
  //     ]);
  //     if (details && details.length > 0) {
  //       setTransactionDetails(details[0]);
  //     }
  //   })();
  // }, [activityItem]);

  // useEffect(() => {
  //   console.log(transactionDetails);
  //   if (transactionDetails && transactionDetails.to) {
  //     (async () => {
  //       const interaction = await getContractInteraction(transactionDetails);
  //       console.log('interaction ', interaction);
  //       // setContractInteraction(interaction);
  //     })();
  //   }
  // }, [transactionDetails]);

  return (
    <div className="mt-4 flex flex-col rounded border border-blue-300 p-3">
      <div className="flex w-full flex-row items-center">
        {walletAddress && walletAddress !== '' && (
          <img
            className="h-12 w-12 rounded-md"
            src={makeBlockie(walletAddress)}
            alt="wallet blockie"
          />
        )}
        <div className="ml-4 flex flex-col items-start justify-start">
          <p className="text-lg font-bold">
            {ensName && ensName !== '' ? ensName : walletAddress}
          </p>
          <p>{format(activityItem.blockTimestamp)}</p>
        </div>
      </div>
      <p className="mt-2">did something with: {activityItem.toAddress}</p>
    </div>
  );
};

export default ActivitySingle;
