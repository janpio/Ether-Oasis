export type ActivityItem = {
  blockNumber: string;
  blockTimestamp: string;
  contractAddress: string | null;
  fromAddress: string;
  toAddress: string;
  transactionHash: string;
  transactionIndex: number;
  value: string;
  assetTransfers?: Transfer[];
  contractInteraction?: string;
};

export type ApiResponse = {
  pageNumber: number;
  paginatedItems: ActivityItem[];
  totalItems: number;
  totalPages: number;
};

export type ActivityResponse = {
  activityItems: ActivityItem[];
  pageNumber: number;
  totalPages: number;
};

export type TransactionHashes = string[];

export interface Transaction {
  _type: 'TransactionReceipt';
  accessList: [];
  blockNumber: number;
  blockHash: string;
  chainId: string;
  data: string;
  from: string;
  gasLimit: string;
  gasPrice: string;
  hash: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
  nonce: number;
  signature: {
    _type: 'signature';
    networkV: null;
    r: string;
    s: string;
    v: number;
  };
  to: string;
  type: number;
  value: string;
}

export type ABI = Array<{
  constant?: boolean;
  inputs?: Array<{ name: string; type: string }>;
  name?: string;
  outputs?: Array<{ name: string; type: string }>;
  payable?: boolean;
  stateMutability?: string;
  type: string;
}>;

export type Transfer = {
  blockNum: string;
  uniqueId: string;
  hash: string;
  from: string;
  to: string;
  value: number | null;
  erc721TokenId: string | null;
  erc1155Metadata: string | null;
  tokenId: string | null;
  asset: string;
  category: string;
  rawContract: {
    value: string;
    address: string;
    decimal: string;
  };
};

export type TransferResponseObject = {
  jsonrpc: string;
  id: number;
  result: {
    transfers: Transfer[];
  };
};

export const defaultTransfer: Transfer = {
  blockNum: '',
  uniqueId: '',
  hash: '',
  from: '',
  to: '',
  value: 0,
  erc721TokenId: null,
  erc1155Metadata: null,
  tokenId: null,
  asset: '',
  category: '',
  rawContract: {
    value: '',
    address: '',
    decimal: '',
  },
};
