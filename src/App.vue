<template>
  <router-view></router-view>
</template>

<script>
</script>

<style lang="scss">
  * {
    font-family: "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  }

  html {
    overflow: hidden;
  }

  a {
    color: white !important;
  }

  /* width */
  ::-webkit-scrollbar {
    width: 12px;
  }

  /* Track */
  ::-webkit-scrollbar-track {
    background: #979797;
  }

  /* Handle */
  ::-webkit-scrollbar-thumb {
    background: rgb(75, 75, 75);
    border-radius: 10px;
  }

  /* Handle on hover */
  ::-webkit-scrollbar-thumb:hover {
    background: rgb(65, 65, 65);
  }
</style>
