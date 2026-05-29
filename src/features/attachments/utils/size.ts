export const sizeInMB = (sizeInBytes: number, decimalsNum = 2) => {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return Number(sizeInMB.toFixed(decimalsNum));
};
