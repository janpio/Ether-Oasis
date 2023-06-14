// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';

import { quickNodeProvider } from '@/utils/quickNodeProvider';

import type { ApiResponse, Token } from './types/tokenTypes';

const parseTokens = (tokens: Token[]): Token[] => {
  const parsedTokens = <Token[]>[];
  tokens.forEach((token) => {
    const parsedToken = <Token>{};
    parsedToken.address = token.address;
    parsedToken.decimals = token.decimals;
    parsedToken.name = token.name;
    parsedToken.quantityIn = token.quantityIn;
    parsedToken.quantityOut = token.quantityOut;
    parsedToken.symbol =
      token.symbol.length > 6 ? token.symbol.slice(0, 6) : token.symbol;
    parsedToken.totalBalance = token.totalBalance;
    if (Number(ethers.formatEther(token.totalBalance)) >= 0.01) {
      parsedTokens.push(parsedToken);
    }
  });
  return parsedTokens;
};

const getTokens = async (walletAddress: string): Promise<Token[]> => {
  const tokens = <Token[]>[];

  const heads: ApiResponse = await quickNodeProvider.send(
    'qn_getWalletTokenBalance',
    [
      {
        wallet: walletAddress,
      },
    ]
  );
  tokens.push(...heads.result);
  return parseTokens(tokens);
};

export default getTokens;
