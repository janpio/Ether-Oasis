export type ActivityItem = {
  blockNumber: string;
  blockTimestamp: string;
  contractAddress: string | null;
  fromAddress: string;
  toAddress: string;
  transactionHash: string;
  transactionIndex: number;
  value: string;
};

export type ApiResponse = {
  pageNumber: number;
  paginatedItems: ActivityItem[];
  totalItems: number;
  totalPages: number;
};
