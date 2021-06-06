import { getRandomIntInclusive } from "../../helper/randomIntInRange";

const FeaturedCategories = (setItem) => {
  let data = [];
  let i = 0;

  while (i < 4) {
    let random_id = getRandomIntInclusive(2, 16);
    const product = {
      id: random_id,
    };

    data.push(product);
    i++;
  }
  setItem(data);
};
export { FeaturedCategories };
