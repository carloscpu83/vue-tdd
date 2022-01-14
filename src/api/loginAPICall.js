import axios from "axios";
import i18n from "../locales/i18n.js";

axios.interceptors.request.use((request)=>{
  request.headers["Accept-Language"] = i18n.global.locale;
  return request;
});

const login = (creds) => {
  //console.log(creds);
  return axios.post("/api/1.0/auth", creds);
};

export default login;
