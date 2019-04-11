<template>
  <div app fixed clipped-left class="console bottom v-toolbar v-toolbar--clipped v-toolbar--fixed theme--dark"
       :class="{'hide-console': isMini, 'show-console': !isMini}">
    <div style="width:100%; height: 23px">
      <span>Console:</span>
      <a class="minimize-button" @click="toogleConsoleView()">toggle console</a>
    </div>
    <div>
      <ul class="scroll-y" style="height: 166px">
        <li class="log-text" v-for="(log, index) in logs.slice().reverse()" :key="index">{{log}}</li>
      </ul>
    </div>
  </div>
</template>
<script>
  import {eventBus} from "../main.js";

  export default {
    created() {
      eventBus.$on("admin", message => {
        this.appendLog(message);
      });
    },
    data: function () {
      return {
        logs: [],
        isMini: false
      };
    },
    methods: {
      toogleConsoleView() {
        this.isMini = !this.isMini;
      },
      appendLog(message) {
        let currentTime = new Date();
        switch (message.type) {
          case "status":
            if (message.status === "disconnect") {
              this.logs.push(
                `[${currentTime.toLocaleTimeString(
                  "en-GB"
                )}.${currentTime.getMilliseconds()}] - User: ${
                  message.id
                  } - Disconnected`
              );
            }
            break;
          case "ping":
            message.list
              .filter(x => !x.hasOwnProperty("error") || x["error"] === "")
              .forEach(ping => {
                this.logs.push(
                  `[${currentTime.toLocaleTimeString(
                    "en-GB"
                  )}.${currentTime.getMilliseconds()}] - User: ${message.id} - ${
                    message.type
                    } - [${ping.ip}]`
                );
              });
            break;
          case "scan":
            message.list
              .filter(x => !x.hasOwnProperty("error") || x["error"] === "")
              .forEach(scan => {
                this.logs.push(
                  `[${currentTime.toLocaleTimeString(
                    "en-GB"
                  )}.${currentTime.getMilliseconds()}] - User: ${
                    message.id
                    } - scan - [${scan.ip}:${scan.port}]`
                );
              });
            break;
          case "rebind":
            if (!message.hasOwnProperty("error") || message["error"] === "") {
              this.logs.push(
                `[${currentTime.toLocaleTimeString(
                  "en-GB"
                )}.${currentTime.getMilliseconds()}] - User: ${message.id} -
              rebind - [${message.ip}:${message.port}]`
              );
            }
            break;
          default:
            break;
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .bottom {
    bottom: 0;
    top: unset;
  }

  .show-console {
    height: 200px;
    transition: 0.2s ease-out;
  }

  .hide-console {
    height: 40px;
    transition: 0.2s ease-out;
  }

  .console {
    border-top: 3px solid #3b4042;
    padding: 10px 0 10px 10px;

    .minimize-button {
      float: right;
      padding-right: 10px;
    }
  }

  .log-text {
    font-family: "Overpass Mono", monospace;
  }

  .log-text::-moz-selection {
    /* Code for Firefox */
    color: white;
    background: #f11919;
  }

  .log-text::selection {
    color: white;
    background: #f11919;
  }
</style>

