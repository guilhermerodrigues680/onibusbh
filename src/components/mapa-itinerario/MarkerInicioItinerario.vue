<template>
  <l-marker :lat-lng="[coords.lat, coords.long]" :icon="markerIcon"> </l-marker>
</template>

<script>
import { icon } from "leaflet";

import { LMarker } from "vue2-leaflet";

export default {
  name: "MarkerInicioItinerario",

  components: {
    LMarker
  },

  props: {
    coords: { type: Object, required: true }
  },

  data: () => ({
    markerIcon: icon({
      iconUrl: require("@/assets/icones-mapa/bandeira_0.png"),
      iconSize: [18, 24],
      iconAnchor: [2, 24],
      popupAnchor: [0, 0]
    })
  })
};
</script>
