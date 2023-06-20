/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import axios from 'axios';
import { ethers } from 'ethers';

import coinGeckoData from '@/utils/CoinGeckoList.json';
import { quickNodeProvider } from '@/utils/quickNodeProvider';

import type { ApiResponse, Token } from './types/tokenTypes';

const tokensData = coinGeckoData.tokens;

const checkIfStartsWith0x = (str: string) => {
  return str.startsWith('0x');
};

const findIdBySymbol = (symbol: string) => {
  const localToken = tokensData.find((token) => token.symbol === symbol);
  return localToken ? localToken.id : '';
};

const findSymbolById = (id: string) => {
  const localToken = tokensData.find((token) => token.id === id);
  return localToken ? localToken.symbol : '';
};

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
    if (
      Number(ethers.formatEther(token.totalBalance)) >= 0.01 &&
      !checkIfStartsWith0x(token.symbol)
    ) {
      parsedTokens.push(parsedToken);
    }
  });
  return parsedTokens;
};

export const getTokens = async (walletAddress: string): Promise<Token[]> => {
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

export const getEthPrice = async () => {
  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: 'ethereum',
          vs_currencies: 'usd',
        },
      }
    );

    const { data } = response;
    return data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return 0;
  }
};

/* 
  TODO:
  convert getTokenPrices to 'getTokensInfo' have it call 'getTokenImage' for each token
  update the return so that updatedTokensWithPrices is a nested object where the token's symbol maps to it's price and logo
*/

export const getTokenImage = async (tokenSymbol: string): Promise<string> => {
  const tokenId = findIdBySymbol(tokenSymbol.toLowerCase());
  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/coins/${tokenId}`
    );

    const { data } = response;
    return data.image.small;
  } catch (error) {
    console.error('Error fetching token image:', error);
    return '';
  }
};

export const getTokenPrices = async (tokensInWallet: Token[]) => {
  const tokenIds = tokensInWallet.map((token) =>
    findIdBySymbol(token.symbol.toLowerCase())
  );

  try {
    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids: tokenIds.join(),
          vs_currencies: 'usd',
        },
      }
    );

    const { data } = response;

    const updatedTokensWithPrices: { [tokenSymbol: string]: number } = {};

    Object.keys(data).forEach((id) => {
      if (Object.prototype.hasOwnProperty.call(data, id)) {
        const price = data[id].usd;
        updatedTokensWithPrices[findSymbolById(id)] = price;
      }
    });

    if (Object.keys(updatedTokensWithPrices).length > 0) {
      return updatedTokensWithPrices;
    }

    return {};
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
};
