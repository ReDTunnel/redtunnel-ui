import Login from "./components/Login.vue";
import Setup from "./components/Setup.vue";
import Dashboard from "./components/Dashboard.vue";

export const routes = [
  {path: "/", component: Dashboard},
  {path: "/login", component: Login},
  {path: "/setup", component: Setup}
];
