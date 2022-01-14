<template>
  <div class="card text-center">
    <div class="card-header">
      <img
        src="../assets/profile.png"
        width="200"
        alt="profile"
        class="rounded-circle shadow"
      />
    </div>
    <div class="card-body">
      <h3>{{ this.user.username }}</h3>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
};
</script>
