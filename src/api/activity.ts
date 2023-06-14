import { quickNodeProvider } from '@/utils/quickNodeProvider';

import type { ActivityItem, ApiResponse } from './types/activityTypes';

const getActivity = async (walletAddress: string, pageNumber: number) => {
  const activityItems: ActivityItem[] = [];
  let localPageNumber = pageNumber;

  const response: ApiResponse = await quickNodeProvider.send(
    'qn_getTransactionsByAddress',
    [
      {
        address: walletAddress,
        page: localPageNumber,
        perPage: 20,
      },
    ]
  );

  activityItems.push(...response.paginatedItems);
  localPageNumber += 1;

  return activityItems;
};

export default getActivity;
