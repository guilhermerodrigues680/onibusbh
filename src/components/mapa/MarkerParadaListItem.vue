<template>
  <l-marker :lat-lng="paradaLatLng" :icon="icon">
    <PopupPrevissoesParada :parada="parada" @popupopen="popupopen" />
  </l-marker>
</template>

<script>
// import { icon, Icon } from "leaflet";
import { icon, latLng } from "leaflet";

import { LMarker } from "vue2-leaflet";
import PopupPrevissoesParada from "./PopupPrevissoesParada.vue";

// delete Icon.Default.prototype._getIconUrl;
// Icon.Default.mergeOptions({
//   iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
//   iconUrl: require('leaflet/dist/images/marker-icon.png'),
//   shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
// });

export default {
  name: "MarkerParadaListItem",

  components: {
    LMarker,
    PopupPrevissoesParada
  },

  props: {
    /**
     * Parada é um objeto do tipo:
     {
        "cod": 14594,
        "siu": "22331",
        "x": -43.874332,
        "y": -19.857867,
        "desc": "RUA FRANCISCO ASSIS DE FREITAS, 45",
        "cor": 4
      }
     */
    parada: { type: Object, required: true }
  },

  data: () => ({
    icon: icon({
      iconUrl: require("../../assets/icones-mapa/busstop.png"),
      iconSize: [20, 30],
      iconAnchor: [10, 30],
      shadowUrl: require("../../assets/icones-mapa/busstop_shadow.png"),
      shadowAnchor: [6, 50],
      shadowSize: [27, 50],
      popupAnchor: [0, -30]
    })
  }),

  computed: {
    paradaLatLng() {
      return latLng(this.parada.y, this.parada.x);
    }
  },

  methods: {
    popupopen: function(latLngParada) {
      this.$emit("popupopen", latLngParada);
    }
  }
};
</script>

<style></style>
