<template>
  <!-- setup form -->
  <v-content>
    <v-container fluid>
      <v-layout flex align-start justify-center>
        <v-layout justify-center>
          <div class="setup-container">
            <v-card dark class="setup-card elevation-5">
              <v-img
                :src="require('../assets/red tunnel.png')"
                aspect-ratio="1"
                hight="250"
                width="250"
                style="margin: 0 auto;"
                contains
              ></v-img>
              <v-card-title>
                <h1 class="setup-title">You must be new here</h1>
                <!-- <h2 class="setup-subtitle">Come, Setup</h2> -->
              </v-card-title>
              <form>
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
                <v-layout align-end justify-end>
                  <v-btn
                    color="#a30000"
                    type="submit"
                    @click.prevent="onSetup"
                    :loading="isWaiting"
                    :disabled="isWaiting"
                  >Setup</v-btn>
                </v-layout>
              </form>
            </v-card>
          </div>
        </v-layout>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import axios from "axios";

export default {
  beforeRouteEnter(to, from, next) {
    axios
      .get("/api/setup")
      .then(res => {
        res.data["required_setup"] ? next() : next("/login");
      })
      .catch(err => {
        console.log(err);
        console.log("Please verify that your server is running");
        next();
      });
  },
  data: function() {
    return {
      username: "",
      password: "",
      isWaiting: false
    };
  },

  methods: {
    onSetup() {
      this.isWaiting = true;
      axios
        .post("/api/setup", {
          username: this.username,
          password: this.password,
        })
        .then(res => {
          if (res.data.success !== undefined) {
            this.$router.push("/");
          } else {
            this.isWaiting = false;
            console.log(res.data);
          }
        })
        .catch(err => {
          this.isWaiting = false;
          console.log(err);
        });
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
  background-color: #ff0000;
  background-blend-mode: multiply;
  position: absolute;
  height: 100%;
  width: 100%;
}

.setup-container {
  margin-top: 0px;

  .setup-card {
    width: 450px;
    padding: 30px 10px 10px 10px;

    .setup-title {
      margin: 0 auto;
    }

    .setup-subtitle {
      margin: 15px auto;
    }
  }
}
</style>
