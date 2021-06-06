import { getRandomIntInclusive } from "../../helper/randomIntInRange";

const BestSellers = (setItem) => {
  let data = [];
  let i = 0;

  while (i < 4) {
    let random_id = getRandomIntInclusive(1, 118);
    const product = {
      id: random_id,
    };

    data.push(product);
    i++;
  }
  setItem(data);
};
export { BestSellers };
