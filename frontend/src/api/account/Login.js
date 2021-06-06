import { PostJson } from "../API";

const Login = (data, callback) => {
  PostJson(
    "/auth/login",
    data,
    (data) => {
      callback(true);
    },
    () => {
      callback(false);
    }
  );
};
export { Login };
