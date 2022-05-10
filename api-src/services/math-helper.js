// https://stackoverflow.com/questions/11832914/how-to-round-to-at-most-2-decimal-places-if-necessary
function roundToDecimalPlaces(num, dp = 2) {
  if (dp < 0) {
    throw Error("decimal places < 0");
  }
  return Math.round((num + Number.EPSILON) * 10 ** dp) / 10 ** dp;
}

export { roundToDecimalPlaces };
