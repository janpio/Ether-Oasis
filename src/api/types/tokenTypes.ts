export type Token = {
  address: string;
  decimals: string;
  name: string;
  quantityIn: string;
  quantityOut: string;
  symbol: string;
  totalBalance: string;
};

export type ApiResponse = {
  pageNumber: number;
  result: Token[];
  totalItems: number;
  totalPages: number;
};
