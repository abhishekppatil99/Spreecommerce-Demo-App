import { PostJson } from "../API";

const Register = (data, callback) => {
  PostJson(
    "/auth/register",
    data,
    (data) => {
      callback(true);
    },
    () => {
      callback(false);
    }
  );
};
export { Register };
