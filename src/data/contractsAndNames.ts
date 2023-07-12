/*
  This file contains a whole boatload of ethereum smart contracts, indexed by address.
  Each contract has it's corresponding name and type. Eventually, I'd also like to get the bytecode in there for each one too.
  Long term, this should probably be stored in some type of database on the backend for greater efficiency.
  TODO: Find a better way to build this list, LOL!
*/

type ContractWithInfo = {
  name: string;
  type: 'Token' | 'NFT' | 'DEX' | 'Defi' | 'Bridge' | 'NFT Market' | 'Other';
};

interface ContractNameAndAddress {
  [contractAddress: string]: ContractWithInfo;
}

export const contractNamesByAddress: ContractNameAndAddress = {
  '0xdac17f958d2ee523a2206206994597c13d831ec7': {
    name: 'USDT',
    type: 'Token',
  },
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
    name: 'WETH',
    type: 'Token',
  },
  '0x881d40237659c251811cec9c364ef91dc08d300c': {
    name: 'Metamask Swap Router',
    type: 'DEX',
  },
  '0x32400084c286cf3e17e7b677ea9583e60a000324': {
    name: 'ZkSync Era Mainnet Bridge',
    type: 'Bridge',
  },
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': {
    name: 'Uniswap V2',
    type: 'DEX',
  },
  '0x00000000000000adc04c56bf30ac9d3c0aaf14dc': {
    name: 'Seaport 1.5',
    type: 'NFT Market',
  },
  '0xb2ecfe4e4d61f8790bbb9de2d1259b9e2410cea5': {
    name: 'Blur Marketplace',
    type: 'NFT Market',
  },
  '0x29469395eaf6f95920e59f858042f0e28d98a20b': {
    name: 'Blur Blend',
    type: 'NFT Market',
  },
  '0xcf50b810e57ac33b91dcf525c6ddd9881b139332': {
    name: 'Convex CVX Rewards Pool',
    type: 'Defi',
  },
  '0x0a760466e1b4621579a82a39cb56dda2f4e70f03': {
    name: 'Convex stEth Rewards Pool',
    type: 'Defi',
  },
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': {
    name: 'stETH',
    type: 'Token',
  },
  '0xdc24316b9ae028f1497c275eb9192a3ea0f67022': {
    name: 'Curve Finance',
    type: 'DEX',
  },
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff': {
    name: '0x Exchange',
    type: 'DEX',
  },
  '0x1111111254eeb25477b68fb85ed929f73a960582': {
    name: '1Inch Exchange',
    type: 'DEX',
  },
  '0x3b3ae790df4f312e745d270119c6052904fb6790': {
    name: 'OKX DEX Aggregator',
    type: 'DEX',
  },
  '0x3fe65692bfcd0e6cf84cb1e7d24108e434a7587e': {
    name: 'Convex cvxCRV Rewards Pool',
    type: 'Defi',
  },
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': {
    name: 'Uniswap V3',
    type: 'DEX',
  },
  '0xc36442b4a4522e871399cd717abdd847ab11fe88': {
    name: 'Uniswap V3 Positions NFT',
    type: 'Defi',
  },
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b': {
    name: 'Old Uniswap Universal Router',
    type: 'DEX',
  },
  '0xb45a2dda996c32e93b8c47098e90ed0e7ab18e39': {
    name: 'TransitSwap',
    type: 'DEX',
  },
  '0x6131b5fae19ea4f9d964eac0408e4408b66337b5': {
    name: 'KyberSwap',
    type: 'DEX',
  },
  '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7': {
    name: 'cvxCRV',
    type: 'Token',
  },
  '0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce': {
    name: 'SHIB',
    type: 'Token',
  },
  '0x5026f006b85729a8b14553fae6af249ad16c9aab': {
    name: 'WOJACK',
    type: 'Token',
  },
  '0x4d9079bb4165aeb4084c526a32695dcfd2f77381': {
    name: 'Across Protocol Bridge',
    type: 'Bridge',
  },
  '0x9008d19f58aabd9ed0d60971565aa8510560ab41': {
    name: 'CoW Protocol Settler',
    type: 'DEX',
  },
  '0xdef171fe48cf0115b1d80b88dc8eab59176fee57': {
    name: 'Paraswap',
    type: 'DEX',
  },
  '0x5e2361cd711de7efe2a85045b643271a64262d40': {
    name: 'Socket Bridge',
    type: 'Bridge',
  },
  '0x74ee68a33f6c9f113e22b3b77418b75f85d07d22': {
    name: 'Zerion Genesis',
    type: 'NFT',
  },
  '0x06012c8cf97bead5deae237070f9587f8e7a266d': {
    name: 'CryptoKitties',
    type: 'NFT',
  },
  '0xf7134ce138832c1456f2a91d64621ee90c2bddea': {
    name: 'WorldCoin ID Manager',
    type: 'Other',
  },
  '0xe42cad6fc883877a76a26a16ed92444ab177e306': {
    name: 'The Merge',
    type: 'NFT',
  },
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
    name: 'USDC',
    type: 'Token',
  },
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad': {
    name: 'Uniswap Universal Router',
    type: 'DEX',
  },
  '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f': {
    name: 'gOHM',
    type: 'Token',
  },
  '0x514910771af9ca656af840dff83e8264ecf986ca': {
    name: 'LINK',
    type: 'Token',
  },
  '0x184f3fad8618a6f458c16bae63f70c426fe784b3': {
    name: 'Olympus Token Migrator',
    type: 'Defi',
  },
  '0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f': {
    name: 'sOHM',
    type: 'Token',
  },
  '0x383518188c0c6d7730d91b2c03a03c837814a899': {
    name: 'OHM v1',
    type: 'Token',
  },
  '0x0000000000c2d145a2526bd8c716263bfebe1a72': {
    name: 'OpenSea Transfer Helper',
    type: 'NFT Market',
  },
  '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f': {
    name: 'SushiSwap',
    type: 'DEX',
  },
  '0xd26114cd6ee289accf82350c8d8487fedb8a0c07': {
    name: 'OMG',
    type: 'Token',
  },
};
