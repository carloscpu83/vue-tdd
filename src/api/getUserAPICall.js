import axios from "axios";

const getUserById = (id) => {
  return axios.get("/api/1.0/users/" + id);
};

export default getUserById;