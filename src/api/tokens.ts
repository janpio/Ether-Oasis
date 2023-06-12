// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';

import type { ApiResponse, Token } from './types/tokenTypes';

const QUICKNODE_RPC_URL = process.env.NEXT_PUBLIC_QUICKNODE_RPC_URL;

const getTokens = async (walletAddress: string): Promise<Token[]> => {
  const tokens = <Token[]>[];

  const provider = new ethers.JsonRpcProvider(QUICKNODE_RPC_URL);
  const heads: ApiResponse = await provider.send('qn_getWalletTokenBalance', [
    {
      wallet: walletAddress,
    },
  ]);
  tokens.push(...heads.result);
  return tokens;
};

export default getTokens;
