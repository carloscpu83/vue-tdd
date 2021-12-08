import { createRouter, createWebHistory } from "vue-router";

import HomePageComponent from "../pages/Homepage.vue";
import LoginPageComponent from "../pages/LoginPage.vue";
import SignUpPageComponent from "../pages/SignUpPage.vue";
import UserPageComponent from "../pages/Userpage.vue";
import ActivationComponent from "../pages/ActivationPage.vue";

const routerConfig = [
  { path: "/", component: HomePageComponent },
  { path: "/login", component: LoginPageComponent },
  { path: "/signup", component: SignUpPageComponent },
  { path: "/user", component: UserPageComponent },
  { path: "/activation/:token", component: ActivationComponent },
];

const router = createRouter({
  routes: routerConfig,
  history: createWebHistory(),
});

export default router;
