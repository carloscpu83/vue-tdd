<template>
  <div class="shadow-sm bg-ligth">
    <nav class="navbar navbar-expand navbar-light container">
      <div class="container-fluid p-0">
        <router-link
          data-testid="logoLink"
          class="navbar-brand"
          to="/"
          title="Home"
        >
          <img
            data-testid="logoImg"
            src="./assets/hoaxify.png"
            width="60"
            alt="Hoaxify logo"
          />
          {{ $t("homepage") }}
        </router-link>
        <ul class="navbar-nav ml-auto">
          <li class="nav-item">
            <router-link class="navbar-link" to="/user" title="User">{{
              $t("userpage")
            }} | </router-link>
          </li>
          <li class="nav-item">
            <router-link class="navbar-link" to="/signup" title="Signup">{{
              $t("signuppage")
            }} | </router-link>
          </li>
          <li class="nav-item">
            <router-link class="navbar-link" to="/login" title="Login">{{
              $t("loginpage")
            }} | </router-link>
          </li>
          <li class="nav-item">
            <router-link class="navbar-link" to="/activation/1234" title="Activation">{{
              $t("activation")
            }}</router-link>
          </li>
        </ul>
      </div>
    </nav>
  </div>

  <div class="container">
    <router-view />
    <language-selector />
  </div>
</template>

<script>
import LanguageSelector from "./components/LanguajeSelector.vue";

export default {
  name: "App",
  components: {
    LanguageSelector,
  },
  data() {
    return {
      path: window.location.pathname,
    };
  },
};
</script>
