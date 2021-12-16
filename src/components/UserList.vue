<template>
  <div class="card">
    <div class="card-header text-center">
      <h3>Users</h3>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item list-group-item-action" v-for="user in page.users" :key="user.id">{{ user.username }}</li>
    </ul>
  </div>
</template>

<script>
import userList from "../api/userListAPICall.js";

export default {
  props: {
    pageNumber: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      page: {
        size: 0,
        totalPages: 0,
        users: [],
      },
    };
  },
  mounted() {
    userList(this.pageNumber).then((response) => {
      const data = response.data;
      this.page.users = data.content;
      this.page.size = data.size;
      this.page.totalPages = data.totalPages;
    });
  },
};
</script>
