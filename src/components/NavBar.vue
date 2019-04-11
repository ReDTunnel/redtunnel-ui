<template>
  <v-toolbar app prominent fixed clipped-left>
    <img src="../assets/red tunnel.png" style="height: 67px; width: auto; margin-top: 5px;">
    <img src="../assets/text.png" style="height: 38px; width: auto; margin-top: 5px; margin-left:20px;">
    <!-- <v-toolbar-title>ReDTunnel</v-toolbar-title> -->
    <v-spacer></v-spacer>
    <v-btn flat @click="onLogout()">Logout</v-btn>
    <v-btn icon @click="configDialog = true">
      <v-icon>settings</v-icon>
    </v-btn>
    <v-dialog v-model="configDialog" max-width="550">
      <app-config-form @closeConfigDialog="configDialog = false"></app-config-form>
    </v-dialog>
  </v-toolbar>
</template>
<script>
import axios from "axios";
export default {
  data: function() {
    return {
      configDialog: false
    };
  },
  methods: {
    onLogout() {
      axios
        .get("/api/logout")
        .then(res => {
          this.$router.push("/login");
        })
        .catch(err => {
          this.$router.push("/login");
          console.log(err);
          console.log("Please verify that your server is running");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>

