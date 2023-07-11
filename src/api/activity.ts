/* eslint-disable no-bitwise */
/* eslint-disable no-console */
import { ethers } from 'ethers';

import { loadProvider } from '@/utils/providers';
import { quickNodeProvider } from '@/utils/quickNodeProvider';

import type {
  ActivityItem,
  ActivityResponse,
  ApiResponse,
  TransactionHashes,
  Transfer,
  TransferResponseObject,
} from './types/activityTypes';
import { defaultTransfer } from './types/activityTypes';

const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;
const ALCHEMY_API_KEY = process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY;

// const checkIfContractAddress = async (address: string) => {
//   const code = await quickNodeProvider.getCode(address);
//   return code !== '0x';
// };

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

    // throw new Error('Failed to fetch ABI.');
    return 0;
  } catch (error) {
    console.error(
      `Failed to fetch ABI for contract at address ${contractAddress}:`,
      error
    );
    throw error;
  }
};

export const getContractInteraction = async (transaction: ActivityItem) => {
  // const isContractAddress = await checkIfContractAddress(transaction.toAddress);

  // if (!isContractAddress) {
  //   return null;
  // }

  const provider = await loadProvider('mainnet');

  const receipt = await provider.getTransaction(transaction.transactionHash);

  const contractABI = await fetchContractABI(transaction.toAddress);

  if (!contractABI || contractABI === 0) {
    console.log('no contract abi');
    return null;
  }

  if (transaction.toAddress && contractABI) {
    const contract = new ethers.Contract(
      transaction.toAddress,
      contractABI,
      quickNodeProvider
    );

    if (!contract.interface) {
      throw new Error('Contract interface not found.');
    }

    if (!receipt?.data) {
      return null;
    }

    const method = contract.interface.parseTransaction({
      data: receipt.data,
      value: receipt.value,
    })?.name;

    // console.log('method', method);
    return {
      contractAddress: transaction.toAddress,
      method,
    };
  }
  return null;
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
        perPage: 5,
      },
    ]
  );

  await Promise.all(
    response.paginatedItems.map(async (item) => {
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

      const contractInteraction = await getContractInteraction(activityItem);
      if (contractInteraction) {
        activityItem.contractInteraction = contractInteraction.method;
      }
      // console.log('activity item receipt', contractInteraction);
      activityItems.push(activityItem);
    })
  );

  // Sort activityItems by blockTimestamp in descending order
  activityItems.sort(
    (a, b) =>
      new Date(b.blockTimestamp).getTime() -
      new Date(a.blockTimestamp).getTime()
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
