/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';

import coinGeckoData from '@/utils/CoinGeckoList.json';

import type { AlchemyToken } from './types/tokenTypes';

const ALCHEMY_MAINNET_NODE_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY}`;
const ALCHEMY_ARBITRUM_NODE_URL = `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_API_KEY}`;

const tokensData = coinGeckoData.tokens;

const ethImages = {
  mainnet: '/assets/images/eth-logos/eth-mainnet-image.png',
  arbitrum: '/assets/images/eth-logos/eth-arbitrum-image.png',
  optimism: '/assets/images/eth-logos/eth-optimism-image.png',
};

type NetworkIdAndNode = {
  id: number;
  nodeUrl: string;
};

type NetworkIdsAndNodesByName = {
  [networkName: string]: NetworkIdAndNode;
};

const networkIdsAndNodesByName: NetworkIdsAndNodesByName = {
  mainnet: {
    id: 1,
    nodeUrl: ALCHEMY_MAINNET_NODE_URL,
  },
  arbitrum: {
    id: 42161,
    nodeUrl: ALCHEMY_ARBITRUM_NODE_URL,
  },
};

// const checkIfStartsWith0x = (str: string) => {
//   return str.startsWith('0x');
// };

const findIdBySymbol = (symbol: string) => {
  const localToken = tokensData.find((token) => token.symbol === symbol);
  return localToken ? localToken.id : '';
};

const findSymbolById = (id: string) => {
  const localToken = tokensData.find((token) => token.id === id);
  return localToken ? localToken.symbol : '';
};

const hexToDecimal = (hex: string): string => {
  // Remove "0x" prefix if present
  const value = hex;

  // Convert hexadecimal to decimal
  const decimal = BigInt(value).toString();

  return decimal;
};

const loadProvider = async (network: string) => {
  const networkData = networkIdsAndNodesByName[network];

  if (!networkData) {
    throw new Error(`Invalid network: ${network}`);
  }

  const provider = new ethers.JsonRpcProvider(
    networkData.nodeUrl,
    networkData.id
  );

  return provider;
};

export const getEthBalance = async (
  walletAddress: string,
  network?: string
) => {
  try {
    const ethersProvider = await loadProvider(network || 'mainnet');
    const balance = await ethersProvider.getBalance(walletAddress);
    const etherString = Number(ethers.formatEther(balance)).toFixed(5);
    return etherString;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export const getTokenPrices = async (tokensInWallet: AlchemyToken[]) => {
  const tokenIds = tokensInWallet.map((token) =>
    findIdBySymbol(token.symbol.toLowerCase())
  );

  try {
    const params = new URLSearchParams({
      ids: tokenIds.join(),
      vs_currencies: 'usd',
    }).toString();

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?${params}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }

    const data = await response.json();

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

export const getAlchemyTokens = async (
  address: string
): Promise<AlchemyToken[]> => {
  const url = ALCHEMY_MAINNET_NODE_URL;
  const options = {
    method: 'POST',
    headers: { accept: 'application/json', 'content-type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_getTokenBalances',
      params: [address],
    }),
  };

  const getBalancesFromAlchemy = async () => {
    // fetching the token balances
    const res = await fetch(url, options);
    const response = await res.json();

    // Getting balances from the response
    const balances = response.result;

    // Remove tokens with zero balance
    const nonZeroBalances = await balances.tokenBalances.filter(
      (token: { tokenBalance: string }) => {
        const convertedBalance = hexToDecimal(token.tokenBalance);
        return (
          convertedBalance !== '0' &&
          convertedBalance !== '0.0' &&
          convertedBalance !== '0.00'
        );
      }
    );

    const alchemyTokens = [];

    // Loop through all tokens with non-zero balance
    for (const token of nonZeroBalances) {
      // Get balance of token
      let balance = token.tokenBalance;

      // request options for making a request to get tokenMetadata
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          id: 1,
          jsonrpc: '2.0',
          method: 'alchemy_getTokenMetadata',
          params: [token.contractAddress],
        }),
      };

      // parsing the response and getting metadata from it
      // eslint-disable-next-line no-await-in-loop
      const res2 = await fetch(url, options);
      // eslint-disable-next-line no-await-in-loop
      let metadata = await res2.json();
      metadata = metadata.result;
      // console.log('metadata', metadata);

      // Compute token balance in human-readable format
      balance /= 10 ** metadata.decimals;
      balance = balance.toFixed(5);
      const combinedToken = { ...metadata, balance, ...token };
      if (combinedToken.symbol.length < 8 && Number(balance) >= 0.01) {
        alchemyTokens.push(combinedToken);
      }
      // Print name, balance, and symbol of token
      // eslint-disable-next-line no-plusplus
    }
    return alchemyTokens;
  };
  const tokensToReturn = await getBalancesFromAlchemy();

  const ethArbitrumBalance = await getEthBalance(address, 'arbitrum');
  const etherArbitrumHoldingsAsAlchemyToken = {
    balance: ethArbitrumBalance,
    contractAddress: '',
    decimals: 18,
    logo: ethImages.arbitrum,
    name: 'Ethereum',
    symbol: 'ETH',
    tokenBalance: ethArbitrumBalance,
  };

  tokensToReturn.unshift(etherArbitrumHoldingsAsAlchemyToken);

  const ethMainnetBalance = await getEthBalance(address, 'mainnet');
  const etherMainnetHoldingsAsAlchemyToken = {
    balance: ethMainnetBalance,
    contractAddress: '',
    decimals: 18,
    logo: ethImages.mainnet,
    name: 'Ethereum',
    symbol: 'ETH',
    tokenBalance: ethMainnetBalance,
  };

  tokensToReturn.unshift(etherMainnetHoldingsAsAlchemyToken);

  const tokenPrices = await getTokenPrices(tokensToReturn);

  const updatedReturn = tokensToReturn.map((token) => {
    const price = tokenPrices[token.symbol.toLowerCase()];
    const updatedToken = { ...token, price: price || null };
    return updatedToken;
  });

  return updatedReturn;
};

export const getEthPrice = async () => {
  try {
    const params = new URLSearchParams({
      ids: 'ethereum',
      vs_currencies: 'usd',
    }).toString();

    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?${params}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch token prices');
    }

    const data = await response.json();
    return data.ethereum.usd;
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return 0;
  }
};

export const getTokenImage = async (tokenSymbol: string): Promise<string> => {
  const tokenId = findIdBySymbol(tokenSymbol.toLowerCase());
  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${tokenId}`
    );

    if (response.ok) {
      const data = await response.json();
      return data.image.small;
    }
    if (!response.ok) {
      console.error('Error fetching token image:', response.status);
      return '';
    }
  } catch (error) {
    console.error('Error fetching token image:', error);
    return '';
  }
  return '';
};
