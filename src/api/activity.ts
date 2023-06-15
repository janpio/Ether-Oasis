import { quickNodeProvider } from '@/utils/quickNodeProvider';

import type {
  ActivityItem,
  ActivityResponse,
  ApiResponse,
} from './types/activityTypes';

const getActivity = async (
  walletAddress: string,
  pageNumber: number
): Promise<ActivityResponse> => {
  const activityItems: ActivityItem[] = [];
  let localPageNumber = pageNumber;
  const activityResponse: ActivityResponse = {
    activityItems: [],
    pageNumber: 1,
    totalPages: 1,
  };

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

  activityResponse.activityItems = activityItems;
  activityResponse.pageNumber = localPageNumber;
  activityResponse.totalPages = response.totalPages;

  return activityResponse;
};

export default getActivity;
