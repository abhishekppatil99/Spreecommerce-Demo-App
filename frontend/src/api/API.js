import { Layout } from "./layout/Layout";
import { Shop } from "./shop/Shop";
import { Account } from "./account/Account";
import Axios from "axios";

const baseURL = "http://localhost:3001/api";

const GetJson = (url, callback, failback, options) => {
  Axios.get(`${baseURL}${url}`, { withCredentials: true })
    .then((res) => {
      if (res.data.success) {
        callback(res.data);
      } else {
        failback();
      }
    })
    .catch((e) => {
      failback(e);
    });
};

const PostJson = (url, data, callback, failback, options) => {
  Axios.post(`${baseURL}${url}`, data, { withCredentials: true })
    .then((res) => {
      if (res.data.success) {
        callback(res.data);
      } else {
        failback();
      }
    })
    .catch((e) => {
      failback(e);
    });
};
const API = {
  shop: Shop,
  layout: Layout,
  account: Account,
};
export { API, GetJson, PostJson, baseURL };
