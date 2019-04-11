<template>
  <!-- Login form -->
  <v-content :class="effectClass">
    <v-container fluid>
      <v-layout column>
        <v-flex xs12>
          <div class="login-container">
            <v-layout align-center justify-center>
              <v-card dark class="login-card elevation-5 flex xs12 md3">
                <v-img
                  :src="require('../assets/red tunnel.png')"
                  aspect-ratio="1"
                  hight="250"
                  width="250"
                  style="margin: 0 auto;"
                  contains
                ></v-img>
                <form autocomplete="off">
                  <v-layout row>
                    <v-flex xs10 offset-xs1>
                      <v-text-field name="username" type="text" v-model="username" label="Username"></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout row>
                    <v-flex xs10 offset-xs1>
                      <v-text-field
                        name="password"
                        type="password"
                        v-model="password"
                        label="Password"
                      ></v-text-field>
                    </v-flex>
                  </v-layout>
                  <v-layout align-center justify-center row fill-height>
                    <v-card-text class="error-message">{{errorMessage}}</v-card-text>
                  </v-layout>
                  <v-layout align-end justify-end>
                    <v-btn
                      color="#a30000"
                      type="submit"
                      @click.prevent="onLoginAttempt"
                      :loading="isWaiting"
                      :disabled="isWaiting"
                    >Login</v-btn>
                  </v-layout>
                </form>
              </v-card>
            </v-layout>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import axios from "axios";
import { eventBus } from "../main.js";

export default {
  beforeRouteEnter(to, from, next) {
    axios
      .get("/api/setup")
      .then(res => {
        res.data["required_setup"] ? next("/setup") : next();
      })
      .catch(err => {
        next();
        //next("/setup");
        console.log(err);
        console.log("Please verify that your server is running");
      });
  },
  mounted() {
    this.changeBackground();
    //this.startBackgroungEffect();
  },
  data: function() {
    return {
      username: "",
      password: "",
      effectClass: "",
      errorMessage: "",
      isWaiting: false
    };
  },
  methods: {
    onLoginAttempt() {
      this.errorMessage = "";
      this.isWaiting = true;
      axios
        .post("/api/login", {
          username: this.username,
          password: this.password
        })
        .then(res => {
          if (res.data.authenticated !== undefined && res.data.authenticated) {
            eventBus.$emit("loggedin", true);
            this.$router.push("/");
          } else {
            this.errorMessage = res.data.error;
            this.isWaiting = false;
          }
        })
        .catch(err => {
          this.isWaiting = false;
          this.errorMessage = "Please verify that your server is running"
          console.log(err);
          console.log("Please verify that your server is running");
        });
    },
    changeBackground() {
      setTimeout(
        () => (this.effectClass = this.effectClass.concat(" add-color")),
        1500
      );
    }
  }
};
</script>

<style lang="scss" scoped>
main {
  background-image: url("../assets/background3.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  position: absolute;
  height: 100%;
  width: 100%;

  &.add-color {
    background-color: #ff0000;
    background-blend-mode: multiply;
    transition: background-color 6s ease-out;
  }
}

.login-container {
  margin-top: 100px;

  .login-card {
    padding: 30px 10px 10px 10px;

    .login-text {
      margin: 0 auto;
    }

    .error-message {
      text-align: center;
    }
  }
}
</style>
