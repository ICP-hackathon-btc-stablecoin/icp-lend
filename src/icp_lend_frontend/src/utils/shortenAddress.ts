export const shortenAddress = (address = "", length = 6) =>
  `${address.substring(0, length / 2 + 2)}...${address.substring(address.length - length / 2)}`;
