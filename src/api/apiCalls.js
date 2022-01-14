import axios from "axios";
import i18n from "../locales/i18n.js";

const signUp = async (body) => {
  return axios
    .post("/api/1.0/users", body);
};

export default signUp;
