import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./locales/i18n.js";
import router from './router/routes.js';
import store from "../src/state/store.js";

createApp(App).
use(i18n).
use(router).
use(store).
mount("#app");
