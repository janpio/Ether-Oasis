export const truncateString = (str: string) => {
  if (str.length <= 8) {
    return str;
  }
  const firstFour = str.slice(0, 4);
  const lastFour = str.slice(-4);
  return `${firstFour}...${lastFour}`;
};

export const truncateAddress = (walletAddress: string) => {
  if (walletAddress.length < 42) {
    return walletAddress;
  }

  const startIdx = Math.floor((walletAddress.length - 12) / 2);
  const endIdx = startIdx + 12;

  const truncatedAddress = `${walletAddress.slice(
    0,
    startIdx
  )}...${walletAddress.slice(endIdx)}`;
  return truncatedAddress;
};
