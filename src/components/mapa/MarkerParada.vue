<template>
  <div>
    <l-marker
      v-for="parada in paradasMarker"
      :key="parada.cod"
      :lat-lng="parada.latLng"
      :icon="icon"
    >
      <PopupPrevissoesParada :parada="parada" @popupopen="popupopen"/>
    </l-marker>
  </div>
</template>

<script>
import { icon, Icon } from "leaflet";

import { LMarker } from "vue2-leaflet";
import PopupPrevissoesParada from "./PopupPrevissoesParada.vue";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: "MarkerParada",

  components: {
    LMarker,
    PopupPrevissoesParada
  },

  props: {
    paradasMarker: Array
  },

  data: () => ({
    icon: icon({
      iconUrl: require('../../assets/icones-mapa/busstop.png'),
      iconSize: [20, 30],
      iconAnchor: [10, 30],
      shadowUrl: require('../../assets/icones-mapa/busstop_shadow.png'),
      shadowAnchor: [6, 50],
      shadowSize: [27,50],
      popupAnchor: [0, -30],
    }),
  }),

  methods: {
    popupopen: function (latLngParada) {
      this.$emit('popupopen', latLngParada)
    }
  }
  
}
</script>

<style>

</style>