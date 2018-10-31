export const padNumber = (value, length = 2) => padLeft(value, '0', length);
export const padLeft = (value, pad, length) => {
  let padded = `${value}`;

  while (padded.length < length) {
    padded = `${pad}${padded}`;
  }

  return padded;
}
