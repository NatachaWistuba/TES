const parseNumber = (numberToBeParsed: string) => {
  if (numberToBeParsed % 1 === 0) return parseInt(numberToBeParsed, 10);

  return parseFloat(numberToBeParsed);
};

export default parseNumber;
