export const truncateString = (str: string) => {
  if (str.length <= 8) {
    return str;
  }
  const firstFour = str.slice(0, 4);
  const lastFour = str.slice(-4);
  return `${firstFour}...${lastFour}`;
};
