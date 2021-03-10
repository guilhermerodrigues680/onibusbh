<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height py-0">
        <MapaParadas />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import MapaParadas from "../components/mapa/MapaParadas.vue";

export default {
  name: "Mapa",
  title: "Mapa Paradas",

  components: {
    MapaParadas
  }
};
</script>