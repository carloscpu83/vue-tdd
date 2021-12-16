import axios from "axios";

const userList = (numberPage = 0) => {
    return axios.get("/api/1.0/users?page=" + numberPage);
  };
  
  export default userList;