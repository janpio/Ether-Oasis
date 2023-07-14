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
  '0x0000000000085d4780b73119b644ae5ecd22b376': {
    name: 'TUSD',
    type: 'Token',
  },
  '0x6b175474e89094c44da98b954eedeac495271d0f': {
    name: 'DAI',
    type: 'Token',
  },
  '0xbc6da0fe9ad5f3b0d58160288917aa56653660e9': {
    name: 'alUSD',
    type: 'Token',
  },
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': {
    name: 'USDC',
    type: 'Token',
  },
  '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd': {
    name: 'GUSD',
    type: 'Token',
  },
  '0x8e870d67f660d95d5be530380d0ec0bd388289e1': {
    name: 'USDP',
    type: 'Token',
  },
  '0xba100000625a3754423978a60c9317c58a424e3d': {
    name: 'BAL',
    type: 'Token',
  },
  '0x744d70fdbe2ba4cf95131626614a1763df805b9e': {
    name: 'SNT',
    type: 'Token',
  },
  '0x853d955acef822db058eb8505911ed77f175b99e': {
    name: 'FRAX',
    type: 'Token',
  },
  '0x3432b6a60d23ca0dfca7761b7ab56459d9c964d0': {
    name: 'FXS',
    type: 'Token',
  },
  '0xac3e018457b222d93114458476f3e3416abbe38f': {
    name: 'sfrxETH',
    type: 'Token',
  },
  '0x5a98fcbea516cf06857215779fd812ca3bef1b32': {
    name: 'LDO',
    type: 'Token',
  },
  '0x6810e776880c02933d47db1b9fc05908e5386b96': {
    name: 'GNO',
    type: 'Token',
  },
  '0x4e3fbd56cd56c3e72c1403e103b45db9da5b9d2b': {
    name: 'CVX',
    type: 'Token',
  },
  '0x5283d291dbcf85356a21ba090e6db59121208b44': {
    name: 'BLUR',
    type: 'Token',
  },
  '0xc00e94cb662c3520282e6f5717214004a7f26888': {
    name: 'COMP',
    type: 'Token',
  },
  '0x5f98805a4e8be255a32880fdec7f6728c6568ba0': {
    name: 'LUSD',
    type: 'Token',
  },
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': {
    name: 'WETH',
    type: 'Token',
  },
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': {
    name: 'WBTC',
    type: 'Token',
  },
  '0x45804880de22913dafe09f4980848ece6ecbaf78': {
    name: 'PAXG',
    type: 'Token',
  },
  '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9': {
    name: 'AAVE',
    type: 'Token',
  },
  '0x111111111117dc0aa78b770fa6a738034120c302': {
    name: '1INCH',
    type: 'Token',
  },
  '0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f': {
    name: 'SNX',
    type: 'Token',
  },
  '0x0f83287ff768d1c1e17a42f44d644d7f22e8ee1d': {
    name: 'sCHF',
    type: 'Token',
  },
  '0x1776e1f26f98b1a5df9cd347953a26dd3cb46671': {
    name: 'NUM',
    type: 'Token',
  },
  '0x0f7f961648ae6db43c75663ac7e5414eb79b5704': {
    name: 'XIO',
    type: 'Token',
  },
  '0x0f8c45b896784a1e408526b9300519ef8660209c': {
    name: 'XMX',
    type: 'Token',
  },
  '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984': {
    name: 'UNI',
    type: 'Token',
  },
  '0x514910771af9ca656af840dff83e8264ecf986ca': {
    name: 'LINK',
    type: 'Token',
  },
  '0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e': {
    name: 'YFI',
    type: 'Token',
  },
  '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2': {
    name: 'SUSHI',
    type: 'Token',
  },
  '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72': {
    name: 'ENS',
    type: 'Token',
  },
  '0x0d8775f648430679a709e98d2b0cb6250d2887ef': {
    name: 'BAT',
    type: 'Token',
  },
  '0x1cEB5cB57C4D4E2b2433641b95Dd330A33185A44': {
    name: 'Keep3r',
    type: 'Token',
  },
  '0x0f5d2fb29fb7d3cfee444a200298f468908cc942': {
    name: 'MANA',
    type: 'Token',
  },
  '0xae7ab96520de3a18e5e111b5eaab095312d7fe84': {
    name: 'stETH',
    type: 'Token',
  },
  '0xae78736cd615f374d3085123a210448e74fc6393': {
    name: 'rETH',
    type: 'Token',
  },
  '0xd533a949740bb3306d119cc777fa900ba034cd52': {
    name: 'CRV',
    type: 'Token',
  },
  '0xaba8cac6866b83ae4eec97dd07ed254282f6ad8a': {
    name: 'YAMv2',
    type: 'Token',
  },
  '0x62b9c7356a2dc64a1969e19c23e4f579f9810aa7': {
    name: 'cvxCRV',
    type: 'Token',
  },
  '0xbb0e17ef65f82ab018d8edd776e8dd940327b28b': {
    name: 'AXS',
    type: 'Token',
  },
  '0x3845badade8e6dff049820680d1f14bd3903a5d0': {
    name: 'SAND',
    type: 'Token',
  },
  '0x4d224452801aced8b2f0aebe155379bb5d594381': {
    name: 'APE',
    type: 'Token',
  },
  '0x1a4b46696b2bb4794eb3d4c26f1c55f9170fa4c5': {
    name: 'BIT',
    type: 'Token',
  },
  '0xd33526068d116ce69f19a9ee46f0bd304f21a51f': {
    name: 'RPL',
    type: 'Token',
  },
  '0x383518188c0c6d7730d91b2c03a03c837814a899': {
    name: 'OHM v1',
    type: 'Token',
  },
  '0x04f2694c8fcee23e8fd0dfea1d4f5bb8c352111f': {
    name: 'sOHM',
    type: 'Token',
  },
  '0x0ab87046fbb341d058f17cbc4c1133f25a20a52f': {
    name: 'gOHM',
    type: 'Token',
  },
  '0xd26114cd6ee289accf82350c8d8487fedb8a0c07': {
    name: 'OMG',
    type: 'Token',
  },
  '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0': {
    name: 'MATIC',
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
  '0x6982508145454Ce325dDbE47a25d4ec3d2311933': {
    name: 'PEPE',
    type: 'Token',
  },
  '0x2af5d2ad76741191d15dfe7bf6ac92d4bd912ca3': {
    name: 'LEO',
    type: 'Token',
  },
  '0x0d438f3b5175bebc262bf23753c1e53d03432bde': {
    name: 'wNXM',
    type: 'Token',
  },
  '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2': {
    name: 'MKR',
    type: 'Token',
  },
  '0x9008d19f58aabd9ed0d60971565aa8510560ab41': {
    name: 'CoW Protocol Settler',
    type: 'DEX',
  },
  '0xdef171fe48cf0115b1d80b88dc8eab59176fee57': {
    name: 'Paraswap',
    type: 'DEX',
  },
  '0x881d40237659c251811cec9c364ef91dc08d300c': {
    name: 'Metamask Swap Router',
    type: 'DEX',
  },
  '0xe592427a0aece92de3edee1f18e0157c05861564': {
    name: 'Uniswap V3',
    type: 'DEX',
  },
  '0x68b3465833fb72a70ecdf485e0e4c7bd8665fc45': {
    name: 'Uniswap V3',
    type: 'DEX',
  },
  '0x7a250d5630b4cf539739df2c5dacb4c659f2488d': {
    name: 'Uniswap V2',
    type: 'DEX',
  },
  '0xdc24316b9ae028f1497c275eb9192a3ea0f67022': {
    name: 'Curve Finance (ETH/stETH)',
    type: 'DEX',
  },
  '0x3b3ae790df4f312e745d270119c6052904fb6790': {
    name: 'OKX DEX Aggregator',
    type: 'DEX',
  },
  '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad': {
    name: 'Uniswap Universal Router',
    type: 'DEX',
  },
  '0xef1c6e67703c7bd7107eed8303fbe6ec2554bf6b': {
    name: 'Uniswap Old Universal Router',
    type: 'DEX',
  },
  '0xdef1c0ded9bec7f1a1670819833240f027b25eff': {
    name: '0x Exchange',
    type: 'DEX',
  },
  '0x000000000022d473030f116ddee9f6b43ac78ba3': {
    name: 'Uniswap',
    type: 'DEX',
  },
  '0xc92e8bdf79f0507f65a392b0ab4667716bfe0110': {
    name: 'CowSwap',
    type: 'DEX',
  },
  '0xd9e1ce17f2641f24ae83637ab66a2cca9c378b9f': {
    name: 'SushiSwap',
    type: 'DEX',
  },
  '0xcf50b810e57ac33b91dcf525c6ddd9881b139332': {
    name: 'Convex CVX Rewards Pool',
    type: 'Defi',
  },
  '0x0a760466e1b4621579a82a39cb56dda2f4e70f03': {
    name: 'Convex stEth Rewards Pool',
    type: 'Defi',
  },
  '0xc21d353ff4ee73c572425697f4f5aad2109fe35b': {
    name: 'Alchemix',
    type: 'Defi',
  },
  '0x3fe65692bfcd0e6cf84cb1e7d24108e434a7587e': {
    name: 'Convex cvxCRV Rewards Pool',
    type: 'Defi',
  },
  '0xc36442b4a4522e871399cd717abdd847ab11fe88': {
    name: 'Uniswap V3 Positions NFT',
    type: 'Defi',
  },
  '0x184f3fad8618a6f458c16bae63f70c426fe784b3': {
    name: 'Olympus Token Migrator',
    type: 'Defi',
  },
  '0x4d9079bb4165aeb4084c526a32695dcfd2f77381': {
    name: 'Across Protocol Bridge',
    type: 'Bridge',
  },
  '0xabea9132b05a70803a4e85094fd0e1800777fbef': {
    name: 'ZkSync Lite Bridge',
    type: 'Bridge',
  },
  '0x32400084c286cf3e17e7b677ea9583e60a000324': {
    name: 'ZkSync Era Mainnet Bridge',
    type: 'Bridge',
  },
  '0x5e2361cd711de7efe2a85045b643271a64262d40': {
    name: 'Socket Bridge',
    type: 'Bridge',
  },
  '0x7be8076f4ea4a4ad08075c2508e481d6c946d12b': {
    name: 'OpenSea v1',
    type: 'NFT Market',
  },
  '0x00000000000000adc04c56bf30ac9d3c0aaf14dc': {
    name: 'Seaport 1.5',
    type: 'NFT Market',
  },
  '0x0000000000c2d145a2526bd8c716263bfebe1a72': {
    name: 'OpenSea Transfer Helper',
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
  '0x74ee68a33f6c9f113e22b3b77418b75f85d07d22': {
    name: 'Zerion Genesis',
    type: 'NFT',
  },
  '0xe42cad6fc883877a76a26a16ed92444ab177e306': {
    name: 'The Merge',
    type: 'NFT',
  },
  '0x0e3a2a1f2146d86a604adc220b4967a898d7fe07': {
    name: 'CARD',
    type: 'NFT',
  },
  '0x06012c8cf97bead5deae237070f9587f8e7a266d': {
    name: 'CryptoKitties',
    type: 'NFT',
  },
  '0x0f7134ce138832c1456f2a91d64621ee90c2bddea': {
    name: 'WorldCoin ID Manager',
    type: 'Other',
  },
};
