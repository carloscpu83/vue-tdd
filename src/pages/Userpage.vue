<template>
  <div data-testid="userPage">
    <h1>{{ $t("userpage") }}</h1>
    <profile-card :user="user" />
    <div class="alert alert-secondary text-center">
      <spinner v-show="dataIsLoading" />
    </div>
    <div class="alert alert-danger text-center">{{ errorMessage }}</div>
  </div>
</template>

<script>
import getUserById from "../api/getUserAPICall.js";
import ProfileCard from "../components/ProfileCard.vue";
import Spinner from "../components/Spinner.vue";

export default {
  components: { ProfileCard, Spinner },
  data() {
    return {
      dataIsLoading: false,
      user: {},
      errorMessage: null,
    };
  },
  async mounted() {
    this.dataIsLoading = true;
    getUserById(this.$route.params.id)
      .then((response) => {
        this.user = response.data;
      })
      .catch((error) => {
        this.errorMessage = error.response.data.message;
      })
      .finally(() => {
        this.dataIsLoading = false;
      });
      await new Promise((r) => setTimeout(r, 1000));
  },
};
</script>
