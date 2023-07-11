/* eslint-disable no-console */
// eslint-disable-next-line import/no-extraneous-dependencies
import { ethers } from 'ethers';

import coinGeckoData from '@/utils/CoinGeckoList.json';
import { loadProvider, networkIdsAndNodesByName } from '@/utils/providers';
import { isTokenBlacklisted } from '@/utils/tokensBlacklist';

import type { AlchemyToken } from './types/tokenTypes';

const tokensData = coinGeckoData.tokens;

const ethImages = {
  mainnet: '/assets/images/eth-logos/eth-mainnet-image.png',
  arbitrum: '/assets/images/eth-logos/eth-arbitrum-image.png',
  optimism: '/assets/images/eth-logos/eth-optimism-image.png',
};

const defaultTokenImage = '/assets/images/default-token.png';

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
  const getBalancesFromAllNetworks = async (): Promise<AlchemyToken[]> => {
    const allTokensAllNetworks: AlchemyToken[] = [];

    for (const network of Object.keys(networkIdsAndNodesByName)) {
      const networkData = networkIdsAndNodesByName[network];

      if (!networkData) {
        throw new Error(`Invalid network: ${network}`);
      }

      const url = networkData.nodeUrl;

      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          id: networkData.id,
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
        const tokensToInclude = balances.tokenBalances.filter(
          (token: { tokenBalance: string; contractAddress: string }) => {
            const convertedBalance = hexToDecimal(token.tokenBalance);
            // console.log('convertedBalance:', convertedBalance);
            // console.log('converted balance !== 0:', convertedBalance !== '0');
            const isBlacklisted = isTokenBlacklisted(token.contractAddress);
            return (
              convertedBalance !== '0' &&
              convertedBalance !== '0.0' &&
              convertedBalance !== '0.00' &&
              !isBlacklisted
            );
          }
        );

        const alchemyTokens: AlchemyToken[] = [];

        // Loop through all tokens with non-zero balance
        for (const token of tokensToInclude) {
          // Get balance of token
          let balance = token.tokenBalance;

          // request options for making a request to get tokenMetadata
          const options2 = {
            method: 'POST',
            headers: {
              accept: 'application/json',
              'content-type': 'application/json',
            },
            body: JSON.stringify({
              id: networkData.id,
              jsonrpc: '2.0',
              method: 'alchemy_getTokenMetadata',
              params: [token.contractAddress],
            }),
          };

          // parsing the response and getting metadata from it
          // eslint-disable-next-line no-await-in-loop
          const res2 = await fetch(url, options2);
          // eslint-disable-next-line no-await-in-loop
          const metadata = await res2.json();

          // Compute token balance in human-readable format
          balance /= 10 ** metadata.result.decimals;
          balance = balance.toFixed(5);
          const combinedToken: AlchemyToken = {
            ...metadata.result,
            balance,
            ...token,
          };
          if (combinedToken.symbol.length < 8 && Number(balance) >= 0.01) {
            alchemyTokens.push(combinedToken);
          }
        }

        return alchemyTokens;
      };

      // eslint-disable-next-line no-await-in-loop
      const tokens = await getBalancesFromAlchemy();
      allTokensAllNetworks.push(...tokens);
    }

    // console.log('allTokensAllNetworks:', allTokensAllNetworks);

    return allTokensAllNetworks;
  };

  const tokensToReturn = await getBalancesFromAllNetworks();

  const ethPrice = await getEthPrice();

  const ethOptimismBalance = await getEthBalance(address, 'optimism');
  const etherOptimismHoldingsAsAlchemyToken = {
    balance: ethOptimismBalance,
    contractAddress: '',
    decimals: 18,
    logo: ethImages.optimism,
    name: 'Ethereum',
    symbol: 'ETH',
    tokenBalance: ethOptimismBalance,
    price: ethPrice,
  };

  if (
    etherOptimismHoldingsAsAlchemyToken.balance &&
    Number(etherOptimismHoldingsAsAlchemyToken.balance) > 0
  ) {
    tokensToReturn.unshift(etherOptimismHoldingsAsAlchemyToken);
  }

  const ethArbitrumBalance = await getEthBalance(address, 'arbitrum');
  const etherArbitrumHoldingsAsAlchemyToken = {
    balance: ethArbitrumBalance,
    contractAddress: '',
    decimals: 18,
    logo: ethImages.arbitrum,
    name: 'Ethereum',
    symbol: 'ETH',
    tokenBalance: ethArbitrumBalance,
    price: ethPrice,
  };

  if (
    etherArbitrumHoldingsAsAlchemyToken.balance &&
    Number(etherArbitrumHoldingsAsAlchemyToken.balance) > 0
  ) {
    tokensToReturn.unshift(etherArbitrumHoldingsAsAlchemyToken);
  }

  const ethMainnetBalance = await getEthBalance(address, 'mainnet');
  const etherMainnetHoldingsAsAlchemyToken = {
    balance: ethMainnetBalance,
    contractAddress: '',
    decimals: 18,
    logo: ethImages.mainnet,
    name: 'Ethereum',
    symbol: 'ETH',
    tokenBalance: ethMainnetBalance,
    price: ethPrice,
  };

  tokensToReturn.unshift(etherMainnetHoldingsAsAlchemyToken);

  const tokenPrices = await getTokenPrices(tokensToReturn);

  const updatedReturn: AlchemyToken[] = tokensToReturn.map((token) => {
    const price: number | undefined = tokenPrices[token.symbol.toLowerCase()];
    const updatedToken: AlchemyToken = {
      ...token,
      logo: token.logo || defaultTokenImage,
      price: price !== undefined ? price : null,
    };
    return updatedToken;
  });
  // console.log('updatedReturn:', updatedReturn);
  return updatedReturn;
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
