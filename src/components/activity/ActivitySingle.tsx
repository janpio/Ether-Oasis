/* eslint-disable no-console */

'use client';

import makeBlockie from 'ethereum-blockies-base64';
import { ethers } from 'ethers';
import { useContext, useMemo, useState } from 'react';
import { format } from 'timeago.js';

import { getTokenImage } from '@/api/tokens';
import type { ActivityItem } from '@/api/types/activityTypes';
import { defaultTransfer } from '@/api/types/activityTypes';
import { GlobalContext } from '@/context/GlobalContext';
import { activityInterpreter } from '@/utils/ActivityInterpreter';
import { truncateAddress } from '@/utils/truncateString';

type Props = {
  activityItem: ActivityItem;
};

type TokenImagesState = {
  [tokenSymbol: string]: string;
};

const ActivitySingle = ({ activityItem }: Props) => {
  const { walletAddress, ensName } = useContext(GlobalContext);
  const [tokenImages, setTokenImages] = useState<TokenImagesState>({});

  useMemo(() => {
    // console.log('activityItem', activityItem);
    const fetchTokenImages = async () => {
      if (
        activityItem.assetTransfers &&
        activityItem.assetTransfers[0] !== defaultTransfer
      ) {
        const fetchedTokenImages: TokenImagesState = {};
        await Promise.all(
          activityItem.assetTransfers.map(async (transfer) => {
            const tokenImage = await getTokenImage(transfer.asset);
            fetchedTokenImages[transfer.asset] = tokenImage;
          })
        );
        setTokenImages(fetchedTokenImages);
      }
    };
    fetchTokenImages();
  }, [activityItem]);

  return (
    <div className="mt-4 flex w-full flex-col rounded border border-blue-300 p-3">
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
            {ensName && ensName !== ''
              ? ensName
              : truncateAddress(walletAddress)}
          </p>
          <p>{format(activityItem.blockTimestamp)}</p>
        </div>
        <span className="mb-auto ml-auto text-blue-500 hover:text-blue-300">
          {activityItem.transactionHash && (
            <a
              href={`https://etherscan.io/tx/${activityItem.transactionHash}`}
              target="_blank"
              rel="noreferrer"
              className="ml-4 text-blue-500 hover:text-blue-300"
            >
              <img
                src="/assets/images/etherscan-logo.png"
                alt="Ether Oasis Logo"
                className="-mt-4 mb-4 mr-1 h-5 w-5 no-underline hover:no-underline"
              />
            </a>
          )}
        </span>
      </div>
      <p className="mt-2">{activityInterpreter(activityItem)}</p>
      <div className="flex flex-row items-start justify-start">
        {activityItem.assetTransfers &&
          activityItem.assetTransfers[0] !== defaultTransfer && (
            <div className="flex flex-row items-start justify-start">
              {activityItem.assetTransfers.map((transfer) => (
                <div
                  key={transfer.uniqueId}
                  className="mr-2 mt-2 flex flex-row items-start justify-start"
                >
                  <p className="rounded border border-gray-600 px-2 py-1 text-sm">
                    <img
                      src={
                        tokenImages[transfer.asset]
                          ? tokenImages[transfer.asset]
                          : '/assets/images/default-token.png'
                      }
                      alt={transfer.asset}
                      className="-mt-1 mr-2 inline-block h-5 w-5 rounded-full"
                    />
                    {transfer.asset}: {transfer.value?.toFixed(2)}{' '}
                    <span>
                      {transfer.to.toLocaleLowerCase() ===
                      walletAddress?.toLocaleLowerCase()
                        ? 'IN'
                        : 'OUT'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        {activityItem.value !== '0' && (
          <div className="mr-2 mt-2 flex flex-row items-start justify-start">
            <p className="rounded border border-gray-600 px-2 py-1 text-sm">
              <img
                src="/assets/images/eth-logos/eth-mainnet-image.png"
                alt="ETH"
                className="-mt-1 mr-2 inline-block h-5 w-5 rounded-full"
              />
              ETH: {Number(ethers.formatEther(activityItem.value)).toFixed(6)}{' '}
              <span>
                {activityItem.toAddress.toLocaleLowerCase() ===
                walletAddress?.toLocaleLowerCase()
                  ? 'IN'
                  : 'OUT'}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivitySingle;
