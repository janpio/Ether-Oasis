export type Token = {
  address: string;
  decimals: string;
  name: string;
  quantityIn: string;
  quantityOut: string;
  symbol: string;
  totalBalance: string;
  image?: string;
};

export type AlchemyToken = {
  balance: string;
  contractAddress?: string;
  decimals: number;
  logo: string;
  name: string;
  symbol: string;
  tokenBalance: string;
  price?: number;
};

export type ApiResponse = {
  pageNumber: number;
  result: Token[];
  totalItems: number;
  totalPages: number;
};

export type TokenData = {
  [tokenSymbol: string]: {
    price: number;
    logo: string;
  };
};
