import axios from "axios";

const activate = (token) => {
  return axios.post("/api/1.0/users/token/" + token);
};

export default activate;