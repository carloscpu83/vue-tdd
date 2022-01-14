<template>
  <div data-testid="userlist">
    <card>
      <template v-slot:header>
        <h3>{{ $t("users") }}</h3>
      </template>
      <template v-slot:body>
        <ul class="list-group list-group-flush">
          <li
            class="list-group-item list-group-item-action"
            v-for="user in page.users"
            @click="$router.push('/user/' + user.id)"
            :key="user.id"
          >
            <router-link :to="'/user/' + user.id">
              <user-list-item :user="user" />
            </router-link>
          </li>
        </ul>
      </template>
      <template v-slot:footer>
        <button
        class="btn btn-outline-secondary btn-sm"
        v-show="page.pageNumber > 0"
        data-testid="previousPageLink"
        @click="loadPreviousElements"
      >
        {{ $t("previous") }}
      </button>
      <button
        class="btn btn-outline-secondary btn-sm float-end"
        v-show="page.pageNumber + 1 < page.totalPages"
        data-testid="nextPageLink"
        @click="loadNextElements"
      >
        {{ $t("next") }}
      </button>
      <spinner v-show="page.loadingData" />
      </template>
    </card>
  </div>
</template>

<script>
import userList from "../api/userListAPICall.js";
import userListItem from "./UserListItem.vue";
import Spinner from "./Spinner.vue";
import Card from "../components/Card.vue";
export default {
  components: {
    userListItem,
    Spinner,
    Card,
  },
  data() {
    return {
      page: {
        size: 0,
        totalPages: 0,
        users: [],
        pageNumber: 0,
        loadingData: false,
      },
    };
  },
  methods: {
    async loadData() {
      this.page.loadingData = true;
      userList(this.page.pageNumber).then((response) => {
        const data = response.data;
        this.page.users = data.content;
        this.page.size = data.size;
        this.page.totalPages = data.totalPages;
      });
      await new Promise((r) => setTimeout(r, 1000));
      this.page.loadingData = false;
    },
    async loadNextElements() {
      this.page.pageNumber += 1;
      await this.loadData();
    },
    async loadPreviousElements() {
      this.page.pageNumber -= 1;
      await this.loadData();
    },
  },
  async mounted() {
    await this.loadData();
  },
};
</script>
