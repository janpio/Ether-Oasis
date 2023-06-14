import { quickNodeProvider } from '@/utils/quickNodeProvider';

import type { ActivityItem, ApiResponse } from './types/activityTypes';

const getActivity = async (walletAddress: string) => {
  const activityItems: ActivityItem[] = [];
  let pageNumber = 1;
  let totalPages = 1;

  while (pageNumber <= totalPages) {
    // eslint-disable-next-line no-await-in-loop
    const response: ApiResponse = await quickNodeProvider.send(
      'qn_getTransactionsByAddress',
      [
        {
          address: walletAddress,
          page: pageNumber,
        },
      ]
    );

    activityItems.push(...response.paginatedItems);
    totalPages = response.totalPages;
    pageNumber += 1;
  }

  return activityItems;
};

export default getActivity;
