import { createApp } from "vue";
import App from "./App.vue";
import i18n from "./locales/i18n.js";
import router from './router/routes.js';

createApp(App).
use(i18n).
use(router).
mount("#app");
