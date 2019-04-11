<template>
  <v-app dark>
    <app-nav-bar></app-nav-bar>
    <v-container class="dashboard">
      <v-layout row>
        <v-flex xs3 class="target-panel-wrapper">
          <app-users></app-users>
        </v-flex>
        <v-flex xs9>
          <app-user-data></app-user-data>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <app-console></app-console>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script>
  import axios from "axios";
  import {eventBus} from "../main.js";

  export default {
    beforeRouteEnter(to, from, next) {
      axios
        .get("/api/authenticated")
        .then(res => {
          if (!res.data["authenticated"]) {
            return next('/login');
          }
          eventBus.$emit("loggedin", true);
          next();
        })
        .catch(err => {
          next('/login');
          console.log(err);
        });
    }
  }
</script>

<style lang="scss" scoped>
  .dashboard {
    margin: 64px 0 0 0;
    padding: 0;

    .target-panel-wrapper {
      background-color: #424242;
      color: white;
    }

    .layout {
      height: 100%;
    }
  }
</style>
