import { ethers } from 'ethers';

const ALCHEMY_MAINNET_NODE_URL = `https://eth-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_API_KEY}`;
const ALCHEMY_ARBITRUM_NODE_URL = `https://arb-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_ARBITRUM_API_KEY}`;
const ALCHEMY_OPTIMISM_NODE_URL = `https://opt-mainnet.g.alchemy.com/v2/${process.env.NEXT_PUBLIC_ALCHEMY_OPTIMISM_API_KEY}`;

type NetworkIdAndNode = {
  id: number;
  nodeUrl: string;
};

type NetworkIdsAndNodesByName = {
  [networkName: string]: NetworkIdAndNode;
};

export const networkIdsAndNodesByName: NetworkIdsAndNodesByName = {
  mainnet: {
    id: 1,
    nodeUrl: ALCHEMY_MAINNET_NODE_URL,
  },
  arbitrum: {
    id: 42161,
    nodeUrl: ALCHEMY_ARBITRUM_NODE_URL,
  },
  optimism: {
    id: 10,
    nodeUrl: ALCHEMY_OPTIMISM_NODE_URL,
  },
};

export const loadProvider = async (network: string) => {
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
