const number_format = (num) => {
  // @ts-ignore
  return parseInt(Math.round(num * 100)) / 100;
};
export { number_format };
