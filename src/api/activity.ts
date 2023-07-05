/* eslint-disable no-bitwise */
/* eslint-disable no-console */
import { ethers } from 'ethers';

import { quickNodeProvider } from '@/utils/quickNodeProvider';

import type {
  ActivityItem,
  ActivityResponse,
  ApiResponse,
  Transaction,
  TransactionHashes,
  Transfer,
  TransferResponseObject,
} from './types/activityTypes';
import { defaultTransfer } from './types/activityTypes';

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY;

const checkIfContractAddress = async (address: string) => {
  const code = await quickNodeProvider.getCode(address);
  return code !== '0x';
};

export const getActivity = async (
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
        perPage: 18,
      },
    ]
  );

  await Promise.all(
    response.paginatedItems.map(async (item) => {
      // const isContractAddress = await checkIfContractAddress(item.toAddress);

      const activityItem: ActivityItem = {
        blockNumber: item.blockNumber,
        blockTimestamp: item.blockTimestamp,
        contractAddress: item.toAddress,
        fromAddress: item.fromAddress,
        toAddress: item.toAddress,
        transactionHash: item.transactionHash,
        transactionIndex: item.transactionIndex,
        value: item.value,
      };

      activityItems.push(activityItem);
    })
  );

  localPageNumber += 1;

  activityResponse.activityItems = activityItems;
  activityResponse.pageNumber = localPageNumber;
  activityResponse.totalPages = response.totalPages;

  return activityResponse;
};

export const fetchTransactionDetails = async (
  transactionHashes: TransactionHashes
) => {
  const transactionPromises = transactionHashes.map((hash) =>
    quickNodeProvider.getTransaction(hash)
  );
  const transactions = await Promise.all(transactionPromises);
  return transactions;
};

export const fetchContractABI = async (contractAddress: string) => {
  try {
    const url = `https://api.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${ETHERSCAN_API_KEY}`;
    const response = await fetch(url);

    if (response.ok) {
      const data = await response.json();
      if (data.status === '1') {
        const { result } = data;
        const abi = JSON.parse(result);
        return abi;
      }
    }

    throw new Error('Failed to fetch ABI.');
  } catch (error) {
    console.error(
      `Failed to fetch ABI for contract at address ${contractAddress}:`,
      error
    );
    throw error;
  }
};

export const getContractInteraction = async (transaction: Transaction) => {
  const isContractAddress = await checkIfContractAddress(transaction.to);

  if (!isContractAddress) {
    return null;
  }

  const contractABI = await fetchContractABI(transaction.to);

  if (transaction.to) {
    const contract = new ethers.Contract(
      transaction.to,
      contractABI,
      quickNodeProvider
    );

    if (!contract.interface) {
      throw new Error('Contract interface not found.');
    }

    const method = contract.interface.parseTransaction({
      data: transaction.data,
    })?.name;

    console.log('method', method);

    return {
      contractAddress: transaction.to,
      method,
    };
  }
  return null;
};

export const getAssetTransfers = async (
  transaction: ActivityItem
): Promise<Transfer[]> => {
  try {
    const hexlifiedBlockNumber = `0x${(
      Number(transaction.blockNumber) >>> 0
    ).toString(16)}`;

    const requestOptions = {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        id: 1,
        jsonrpc: '2.0',
        method: 'alchemy_getAssetTransfers',
        params: [
          {
            fromBlock: hexlifiedBlockNumber,
            toBlock: hexlifiedBlockNumber,
            toAddress: transaction.fromAddress,
            category: ['erc20'],
          },
        ],
      }),
    };

    const response = await fetch(
      `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      requestOptions
    );
    const responseObject: TransferResponseObject = await response.json();

    if (
      responseObject.result &&
      responseObject.result.transfers &&
      responseObject.result.transfers.length > 0
    ) {
      return responseObject.result.transfers;
    }

    return [defaultTransfer];
  } catch (error) {
    console.error('caught error ', error);
    return [defaultTransfer];
  }
};
