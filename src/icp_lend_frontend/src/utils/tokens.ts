export const formatToken = (value: bigint, decimals = 8) => Number(value) / (10 ** decimals) ** 2;

export const parseToken = (value: string, decimals = 8): bigint => BigInt(Number(value) * 10 ** decimals);
