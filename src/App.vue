<template>
  <v-app id="app">
      <app-navigation></app-navigation>
      <!-- <Menu /> -->
      <v-content transition="slide-x-transition">
          <router-view></router-view>
      </v-content>
  </v-app>
</template>

<script>
import AppNavigation from '@/components/AppNavigation';

export default {
  name: 'App',

  components: {
    AppNavigation,
  },

  data: () => ({
    //
  }),
};
</script>
