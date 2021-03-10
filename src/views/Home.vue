<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <!-- <v-img
          :src="require('../assets/logo.svg')"
          class="my-3"
          contain
          height="200"
        /> -->
        <v-img
          :src="require('../assets/icones-mapa/busstop.png')"
          class="my-3"
          contain
          height="200"
        />
      </v-col>
      <v-col cols="12">
        <v-btn
          v-for="link in links"
          :key="link.title"
          :to="link.to"
          color="primary"
          class="ma-2"
          elevation="0"
          outlined
          x-large
        >
          <v-icon>{{link.icon}}</v-icon>
          <span>{{link.title}}</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
// @ is an alias to /src
import AppNavigation from '@/components/AppNavigation.vue'

export default {
  name: 'Home',
  title: 'Home',
  
  components: {
    //
  },

  data: () => ({
    links: []
  }),

  created: function () {
    const { links } = AppNavigation.data()
    this.links = links.filter(l => l.to !== '/')
  }
}
</script>
