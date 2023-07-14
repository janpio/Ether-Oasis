/* eslint-disable import/no-extraneous-dependencies */
import { parseSwap } from '@0x/0x-parser';

const EXCHANGE_PROXY_ABI_URL =
  'https://raw.githubusercontent.com/0xProject/protocol/development/packages/contract-artifacts/artifacts/IZeroEx.json';

export const parse0xSwap = async (swapTxHash: string) => {
  const response = await fetch(EXCHANGE_PROXY_ABI_URL);
  const IZeroEx = await response.json();
  const data = await parseSwap({
    rpcUrl: 'https://eth.llamarpc.com',
    exchangeProxyAbi: IZeroEx.compilerOutput.abi,
    transactionHash: swapTxHash,
  });

  return data;
};
