<template>
  <div>
    <img
      src="../assets/profile.png"
      width="30"
      alt="profile"
      class="rounded-circle shadow-sm"
    />{{ user.username }}
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
