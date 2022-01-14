<template>
  <div data-testid="homePage">
    <h1 data-testid="homePageLink">{{ $t("homepage") }}</h1>
  </div>
  <user-list />
</template>

<script>
import UserList from "../components/UserList.vue";
export default {
  components: {
    UserList,
  },
};
</script>
