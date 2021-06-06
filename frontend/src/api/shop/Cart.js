import { GetJson, PostJson } from "../API";

const Get = (setItems) => {
  return GetJson("/cart/", setItems);
};
const Update = (item) => {
  return PostJson("/shop/cart/push", item);
};

const Cart = {
  get: Get,
  update: Update,
};
export { Cart };
