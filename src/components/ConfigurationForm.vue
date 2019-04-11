<template>
  <v-container>
    <h2>Settings</h2>
    <form autocomplete="off">
      <v-layout row>
        <v-flex xs5>
          <v-text-field name="pingPort" type="number" v-model="config.pingPort" label="Ping port"></v-text-field>
        </v-flex>
        <v-flex xs5 offset-xs2>
          <v-text-field
            name="pingTimeout"
            type="number"
            v-model="config.pingTimeout"
            label="Ping timeout"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs5>
          <v-text-field name="poolSize" type="number" v-model="config.poolSize" label="Pool size"></v-text-field>
        </v-flex>
        <v-flex xs5 offset-xs2>
          <v-text-field
            name="scanTimeout"
            type="number"
            v-model="config.scanTimeout"
            label="Scan Timeout"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs5>
          <v-text-field
            name="rebindInterval"
            type="number"
            v-model="config.rebindInterval"
            label="Rebind interval"
          ></v-text-field>
        </v-flex>
        <v-flex xs5 offset-xs2>
          <v-text-field
            name="responseTimeout"
            type="number"
            v-model="config.responseTimeout"
            label="Response Timeout"
          ></v-text-field>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs5>
          <v-checkbox
            v-model="config.loopBackOnly"
            :label="`Loop Back Only`"
            color="red"
            hide-details
          ></v-checkbox>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs5>
          <v-checkbox
            v-model="config.findAuthResponses"
            :label="`Find Auth Responses`"
            color="red"
            hide-details
          ></v-checkbox>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs5>
          <v-checkbox v-model="config.shuffelIps" :label="`Shuffel IPs`" color="red" hide-details></v-checkbox>
        </v-flex>
      </v-layout>
      <v-layout row>
        <v-flex xs12>
          <v-text-field
            v-model="portInput"
            name="ports"
            type="text"
            label="Add ports to scanner"
            v-on:keydown.enter.prevent="checkChip"
          ></v-text-field>
          <div class="text-xs-center">
            <v-chip
              outline
              close
              v-for="port in config.ports"
              :key="port"
              @input="remove(port)"
            >{{port}}</v-chip>
          </div>
        </v-flex>
      </v-layout>
      <v-layout align-end justify-end>
        <v-btn
          color="info"
          type="submit"
          @click.prevent="onSave"
          :loading="isWaiting"
          :disabled="isWaiting"
        >Save Changes</v-btn>
      </v-layout>
    </form>
  </v-container>
</template>
<script>
import Vue from "vue";
import axios from "axios";

export default {
  created() {
    axios
      .get("/api/config")
      .then(res => {
        Vue.set(this, "config", res.data);
      })
      .catch(err => {
        console.log(err);
      });
  },
  data: function() {
    return {
      config: {
        pingPort: 65535,
        pingTimeout: 2000,
        poolSize: 10,
        scanTimeout: 2500,
        rebindInterval: 5000,
        responseTimeout: 150000,
        loopBackOnly: false,
        findAuthResponses: false,
        shuffelIps: false,
        ports: [80, 54, 23123]
      },
      portInput: "",
      isWaiting: false
    };
  },
  methods: {
    remove(port) {
      this.config.ports.splice(this.config.ports.indexOf(port), 1);
      this.config.ports = [...this.config.ports];
    },
    checkChip(input) {
      if (input.key === "Enter") {
        let inputNum = parseInt(this.portInput);
        if (!isNaN(inputNum)) {
          this.config.ports.push(inputNum);
        }
        this.portInput = "";
      }
    },
    onSave() {
      this.isWaiting = true;
      axios
        .post("/api/config", this.config)
        .then(res => {
          console.log(res);
          this.isWaiting = false;
          this.$emit("closeConfigDialog");
        })
        .catch(err => {
          console.log(err);
          this.isWaiting = false;
          this.$emit("closeConfigDialog");
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.container {
  background-color: #232323;
}
</style>
