import { ethers } from 'ethers';
import type { ReactElement } from 'react';

import type { ActivityItem } from '@/api/types/activityTypes';
import { contractNamesByAddress } from '@/data/contractsAndNames';

// takes the ActivityItem object and returns a string or ReactElement
export const activityInterpreter = (item: ActivityItem) => {
  const interactionValue = item.value === '0' ? null : item.value;
  const logs = item.transactionReceipt?.logs;
  const abiCoder = new ethers.AbiCoder();
  /* 
    using above info plus the contract method (item.contractInteraction)
    action is reassigned to form a readable sentence describing the activity
  */
  let action: ReactElement | string = '';

  if (
    !item.contractInteraction &&
    item.contractType === 'Bridge' &&
    interactionValue
  ) {
    action = (
      <>
        Bridged {Number(ethers.formatEther(interactionValue)).toFixed(6)} ETH
        via: <br /> {item.contractName}
      </>
    );
    return action;
  }

  if (item.contractInteraction === 'withdraw') {
    action = (
      <>
        Withdrew from:
        <br /> {item.contractName}
      </>
    );
    return action;
  }

  if (item.contractInteraction === 'getReward') {
    action = (
      <>
        Claimed rewards from:
        <br /> {item.contractName}
      </>
    );
    return action;
  }

  if (item.contractType === 'Token' && item.contractInteraction === 'approve') {
    let contractAddressGranted;
    let nameOfContractGivenApproval;
    if (logs && logs.length > 0) {
      const { topics } = logs[0] as any;
      if (topics && topics.length > 0) {
        contractAddressGranted = abiCoder.decode(
          ['address'],
          topics[topics.length - 1].toLowerCase()
        )[0] as string;
        contractAddressGranted = contractAddressGranted.toLowerCase();
        nameOfContractGivenApproval =
          contractNamesByAddress[contractAddressGranted]?.name;
      }
    }
    if (contractAddressGranted && nameOfContractGivenApproval) {
      action = (
        <>
          Approved {item.contractName} to be used by{' '}
          {nameOfContractGivenApproval}
        </>
      );
    } else if (contractAddressGranted && !nameOfContractGivenApproval) {
      action = (
        <>
          Approved {item.contractName} to be used by {contractAddressGranted}
        </>
      );
    } else {
      action = <>Approved {item.contractName} to be used by another contract</>;
    }
    return action;
  }

  if (item.contractName === '0x Exchange' && item.swapData) {
    action = (
      <>
        Swapped {Number(item.swapData.tokenIn.amount).toFixed(5)}{' '}
        {item.swapData.tokenIn.symbol} for{' '}
        {Number(item.swapData.tokenOut.amount).toFixed(5)}{' '}
        {item.swapData.tokenOut.symbol}
        <br /> via: {item.contractName}
      </>
    );
    return action;
  }

  if (item.contractInteraction) {
    action = `did something (${item.contractInteraction}) with: ${item.contractName}`;
    return action;
  }

  if (!item.contractInteraction && item.contractType !== 'Bridge') {
    action = `did something with: ${item.contractName}`;
    return action;
  }
  return action;
};
