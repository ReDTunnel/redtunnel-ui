<template>
  <div>
    <v-list dense>
      <v-list-tile class="target-title">
        <h2>Targets:</h2>
      </v-list-tile>
      <v-list-tile
        :class="{'active': targetId === idOfUserDetails}"
        v-for="(target, targetId) in targets"
        :key="targetId"
        @click="showDetails(targetId)"
      >
        <v-list-tile-content>
          <v-list-tile-title>
            {{targetId}}
            <!-- <span class="badge">{{target.hostCount}}</span> -->
            <!-- <span>{{target.info.filter(x=> x.hasOwnProperty('hostname')).length}}</span> -->
          </v-list-tile-title>
        </v-list-tile-content>
        <v-list-tile-action>
          <v-icon v-if="target.status === 'offline'" :class="target.status">power_off</v-icon>
          <v-icon v-else :class="target.status">power</v-icon>
        </v-list-tile-action>
      </v-list-tile>
    </v-list>
  </div>
</template>
<script>
import Vue from "vue";
import { eventBus } from "../main.js";

export default {
  data: function() {
    return {
      targets: {},
      idOfUserDetails: ""
    };
  },
  created() {
    eventBus.$on("admin", message => {
      switch (message.type) {
        case "status":
          this.statusMessageUpdate(message);
          break;
        case "ping":
          this.pingMessageUpdate(message);
          break;
        case "scan":
          this.scanMessageUpdate(message);
          break;
        case "rebind":
          this.rebindMessageUpdate(message);
          break;
        default:
          break;
      }
      if (this.idOfUserDetails === message.id) {
        this.showDetails(message.id);
      }
    });
  },
  methods: {
    removeTarget(id) {
      Vue.delete(this.targets, id);
      if (this.idOfUserDetails === id) {
      eventBus.$emit("details", [], "");
      this.idOfUserDetails = "";
      }
    },
    statusMessageUpdate(message) {
      let _this = this;
      let status = this.determinStatus(message);

      let timer = null;
      if (status === "offline") {
        timer = setTimeout(() => _this.removeTarget(message.id), 60000);
      } else if (this.targets[message.id]) {
        clearTimeout(this.targets[message.id].timer);
        this.targets[message.id].timer = null;
      }

      Vue.set(this.targets, message.id, {
        status: status,
        info: [],
        timer: timer
      });
    },
    pingMessageUpdate(message) {
      Vue.set(this.targets, message.id, {
        status: this.determinStatus(message),
        info: message.list
          .filter(x => !x.hasOwnProperty("error") || x["error"] === "")
          .map(y => {
            return { ip: y.ip };
          }),
        timer: null
      });
    },
    scanMessageUpdate(message) {
      Vue.set(this.targets, message.id, {
        status: this.determinStatus(message),
        info: message.list
          .filter(x => !x.hasOwnProperty("error") || x["error"] === "")
          .map(y => {
            return { ip: y.ip, port: y.port };
          }),
        timer: null
      });
    },
    rebindMessageUpdate(message) {
      if (message.hasOwnProperty("error") && message["error"] !== "") {
        if (this.targets[message.id]) {
          let indexOfError = this.targets[message.id].info.findIndex(
            x => x.ip === message.ip && x.port === message.port
          );
          this.targets[message.id].info.splice(indexOfError, 1);
        }
      } else if (this.targets[message.id]) {
        this.targets[message.id].status = this.determinStatus(message);
        let el = this.targets[message.id].info.find(
          x => x.ip === message.ip && x.port === message.port
        );
        if (el) {
          el.hostname = message.hostname;
        } else {
          this.targets[message.id].info.push({
            ip: message.ip,
            port: message.port,
            hostname: message.hostname
          });
        }
      } else {
        Vue.set(this.targets, message.id, {
          status: this.determinStatus(message),
          info: [
            {
              ip: message.ip,
              port: message.port,
              hostname: message.hostname
            }
          ],
          timer: null
        });
      }
    },
    determinStatus(message) {
      switch (message.type) {
        case "status":
          return message.status === "disconnect" ? "offline" : "connecting";
          break;
        case "ping":
          return "connecting";
          break;
        case "scan":
          return "connecting";
          break;
        case "rebind":
          return "online";
          break;
        default:
          break;
      }
    },
    showDetails(id) {
      eventBus.$emit("details", this.targets[id].info, id);
      this.idOfUserDetails = id;
    }
  }
};
</script>
<style lang="scss" scoped>
.online {
  color: #4caf50 !important;
  text-shadow: 0 0 10px;
}

.offline {
  color: #f44336 !important;
  text-shadow: 0 0 10px;
}

.connecting {
  color: #ffc107 !important;
  text-shadow: 0 0 10px;
  animation: blink-animation 1s steps(5, start) infinite;
  -webkit-animation: blink-animation 1s steps(5, start) infinite;
}

@keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

@-webkit-keyframes blink-animation {
  to {
    visibility: hidden;
  }
}

.v-list__tile {
  padding-left: 35px;
}

.badge {
  background-color: #4d3fcd;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  padding: 2px 5px;
}

.v-list {
  max-height: calc(100% - 246px);

  .active {
    background: rgba(255, 255, 255, 0.08);
  }

  .target-title {
    .v-list__tile {
      padding: 35px 16px 16px 16px;
    }
  }
}
</style>
