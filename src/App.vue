
<template>
  <v-app>
    <v-navigation-drawer
      class="z-index1010"
      v-model="drawer"
      app
    >
      <AppNavigation />
    </v-navigation-drawer>

    <v-app-bar
      app
      color="primary"
      dark
      elevate-on-scroll
      >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-toolbar-title>Debug</v-toolbar-title>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>

    <v-footer absolute color="primary" dark app>
      <v-col
        class="text-center"
        cols="12"
      >
        <strong>Debug</strong> - {{ new Date().getFullYear() }}
      </v-col>
    </v-footer>
  </v-app>
</template>

<script>
import AppNavigation from './components/AppNavigation.vue';
export default {
  name: 'App',
  title: 'Debug',
  
  components: {
    AppNavigation,
  },
  
  data: () => ({
    drawer: null
  }),
};
</script>

<style scoped>
.z-index1010 {
  z-index: 1010;  
}
</style>
