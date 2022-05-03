<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height py-0">
        <MapaCodItinerario
          :itinerarios="itinerarios"
          :codItinerario="$route.params.codItinerario + ''"
          :parada="parada"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MapaCodItinerario from "../components/mapa-itinerario/MapaCodItinerario.vue";

import { getItinerario, getParada } from "../services/onibusbh-api-gateway";

export default {
  name: "MapaItinerario",
  title: "Mapa Itinerário",

  components: {
    MapaCodItinerario
  },

  data: () => ({
    itinerarios: [],
    parada: null
  }),

  async created() {
    const { codItinerario } = this.$route.params;
    const { codParada } = this.$route.query;
    console.debug("codItinerario, codParada", codItinerario, codParada);

    const apiResItinerarios = await getItinerario(codItinerario);
    this.itinerarios = apiResItinerarios.itinerarios;

    if (codParada) {
      try {
        const parada = await getParada(codParada);
        this.parada = parada;
      } catch (error) {
        console.error("erro getParada", error);
      }
    }
  }
};
</script>
