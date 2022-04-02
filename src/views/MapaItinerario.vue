<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height py-0">
        <MapaCodItinerario :itinerarios="itinerarios" :codItinerario="$route.params.codItinerario+''" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MapaCodItinerario from "../components/mapa-itinerario/MapaCodItinerario.vue";

import { getItinerario } from "../services/onibusbh-api-gateway";

export default {
  name: "MapaItinerario",
  title: "Mapa Itinerário",

  components: {
    MapaCodItinerario
  },

  data: () => ({
    itinerarios: []
  }),

  created: async function () {
    const { codItinerario } = this.$route.params
    console.log(this)
    const apiResItinerarios = await getItinerario(codItinerario)
    this.itinerarios = apiResItinerarios.itinerarios
  }
};
</script>
