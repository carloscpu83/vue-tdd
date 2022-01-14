<template>
  <NavBar />
  <div class="container">
    <router-view />
    <language-selector />
  </div>
</template>

<script>
import LanguageSelector from "./components/LanguajeSelector.vue";
import NavBar from "./components/NavBar.vue";
export default {
  name: "App",
  components: {
    LanguageSelector,
    NavBar
  },
  data() {
    return {
      path: window.location.pathname,
    };
  },
};
</script>
