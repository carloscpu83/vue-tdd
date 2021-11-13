<template>
  <span data-testid="esLanguage" @click="changeToSpanish">
    <img
      src="https://flagcdn.com/16x12/es.png"
      srcset="
        https://flagcdn.com/32x24/es.png 2x,
        https://flagcdn.com/48x36/es.png 3x
      "
      width="16"
      height="12"
      alt="Spain"
    />
  </span>
  <span data-testid="enLanguage" @click="changeToEnglish">
    <img
      src="https://flagcdn.com/16x12/gb.png"
      srcset="
        https://flagcdn.com/32x24/gb.png 2x,
        https://flagcdn.com/48x36/gb.png 3x
      "
      width="16"
      height="12"
      alt="United Kingdom"
    />
  </span>
</template>

<script>
export default {
  methods: {
    changeToSpanish() {
      this.$i18n.locale = "es";
    },
    changeToEnglish() {
      this.$i18n.locale = "en";
    },
  },
};
</script>

<style scoped>
img {
  cursor: pointer;
  margin-left: 5px;
}
</style>
