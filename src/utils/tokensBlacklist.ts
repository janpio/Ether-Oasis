const blacklistedAddresses: Set<string> = new Set([
  '0xc12d1c73ee7dc3615ba4e37e4abfdbddfa38907e',
]);

export const isTokenBlacklisted = (contractAddress: string): boolean => {
  return blacklistedAddresses.has(contractAddress.toLocaleLowerCase());
};
