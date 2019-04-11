<template>
  <v-container grid-list-md fluid class="targets-data">
    <!-- <v-container grid-list-md fluid class="scroll-y targets-data"> -->
    <v-layout row wrap>
      <v-flex xs8>
        <h2>User ID: {{this.userId}}</h2>
      </v-flex>
      <v-flex xs10 class="details-table" v-if="this.userId !== ''">
        <v-card>
          <v-card-title class="search-title">
            <v-flex xs3 class="text-xs-right">
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              ></v-text-field>
            </v-flex>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :search="search"
            :items="scanResult"
            :rows-per-page-items="[5]"
            class="elevation-2 dark"
          >
            <template slot="items" slot-scope="props">
              <td>{{ props.item.ip }}</td>
              <td class="text-xs-center"><span v-if="props.item.port">
                  {{ props.item.port }}
                  </span>
                <span v-else>Scanning ports</span>
              </td>
              <td class="text-xs-right">
                <v-btn
                  v-if="props.item.hostname"
                  :href="'http://' + props.item.hostname"
                  :title="props.item.hostname"
                  target="_blank"
                  dark
                  small
                  color="error"
                >explore
                </v-btn>
                <span v-else-if="props.item.port">Scanning for hosts</span>
                <span v-else></span>
              </td>
            </template>
            <template slot="no-data">
              <v-alert :value="true" color="error" icon="warning">Scanning the network</v-alert>
            </template>
            <v-alert
              slot="no-results"
              :value="true"
              color="error"
              icon="warning"
            >"{{ search }}" is not there.
            </v-alert>
          </v-data-table>
        </v-card>
      </v-flex>
      <v-flex xs10 text-xs-center v-else class="no-data-text"><span>Select Target to show info</span></v-flex>
    </v-layout>
  </v-container>
</template>
<script>
  import Vue from "vue";
  import {eventBus} from "../main.js";

  export default {
    created() {
      eventBus.$on("details", (details, userId) => {
        self = this;
        self.scanResult = [...details];
        this.userId = userId;
      });
    },
    data: function () {
      return {
        userId: "",
        scanResult: [],
        headers: [
          {
            text: "IP Address",
            align: "left",
            value: "ip"
          },
          {text: "Port", align: "center", value: "port"},
          {
            text: "Host Name",
            align: "right",
            value: "hostname"
          }
        ],
        search: ""
      };
    }
  };
</script>
<style lang="scss" scoped>
  .v-expansion-panel__body {
    padding-bottom: 20px;
  }

  .v-card__text {
    padding: 5px 16px;
  }

  .targets-data {
    max-height: calc(100% - 230px) !important;
  }

  .lighter {
    background-color: #565656;
  }

  .info-expansion {
    padding-left: 40px;
  }

  .details-table {
    margin: 20px auto;
  }

  .no-data-text {
    margin-top: 30px;
  }

  .search-title {
    padding-top: 0;
  }
</style>
