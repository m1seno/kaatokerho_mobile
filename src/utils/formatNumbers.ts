export const formatNumberOneDecimal = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(1);
};

export const formatNumberTwoDecimals = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString();
  }
  return value.toFixed(2);
};