import Vue from "vue";
import io from 'socket.io-client';
import "./plugins/vuetify";
import Vuetify from "vuetify";
import VueLodash from 'vue-lodash'
import VueRouter from "vue-router";
import axios from "axios";
import {routes} from "./routes";
import AppComponent from "./App.vue";
import NavBarComponent from "./components/NavBar.vue";
import UsersComponent from "./components/Users.vue";
import UserDataComponent from "./components/UserData.vue";
import ConsoleComponent from "./components/Console.vue";
import ConfigurationFormComponent from "./components/ConfigurationForm.vue";
import DashboardComponent from "./components/Dashboard.vue";
import LoginComponent from "./components/Login.vue";
import SetupComponent from "./components/Setup.vue";

export const eventBus = new Vue({
  created() {
    this.$on('loggedin', function (isLogged) {
      if (isLogged) {
        this.getInitialData()
          .then(this.connectToSocket())
          .catch(err => console.log(err))
      }
    });
  },
  methods: {
    getInitialData() {
      return new Promise((resolve, reject) => {
        axios.get("/api/init").then(initialData => {
          initialData.data.forEach(singleRebind => {
            singleRebind.type = 'rebind';
            this.$emit('admin', singleRebind)
          });
          resolve(true)
        }).catch(err => reject(err))
      })
    },
    connectToSocket() {
      if (viewVue.socket) {
        return;
      }

      let socket = io({
        query: {"id": 'admin'},
        transports: ['websocket']
      });

      socket.on('admin', (data) => {
        this.$emit('admin', data)
        // console.log(data)
      });

      socket.on('connect', () => {
        console.log('ws connected')
      });

      socket.on('disconnected', () => {
        console.log('ws disconnected')
      });

      viewVue.socket = socket;
    }
  },
  data() {
    return {
      socket: null,
    }
  },
});

axios.defaults.baseURL = '/';
Vue.use(VueRouter);
const router = new VueRouter({
  mode: 'history',
  routes
});

Vue.use(Vuetify);
Vue.use(VueLodash);
Vue.config.productionTip = false;
Vue.component("app-nav-bar", NavBarComponent);
Vue.component("app-users", UsersComponent);
Vue.component("app-user-data", UserDataComponent);
Vue.component("app-console", ConsoleComponent);
Vue.component("app-config-form", ConfigurationFormComponent);
Vue.component("app-login", LoginComponent);
Vue.component("app-setup", SetupComponent);
Vue.component("app-dashboard", DashboardComponent);

const viewVue = new Vue({
  el: "#app",
  router,
  render: h => h(AppComponent)
});
