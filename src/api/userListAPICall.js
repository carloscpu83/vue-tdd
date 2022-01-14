import axios from "axios";

const userList = (page) => {
    return axios.get("/api/1.0/users", {
      params: {
        page,
        size: 3
      }
    });
  };
  
  export default userList;