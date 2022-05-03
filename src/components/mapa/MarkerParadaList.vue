<template>
  <div>
    <MarkerParadaListItem
      v-for="parada in paradasMarker"
      :key="parada.cod"
      :parada="parada"
      @popupopen="popupopen"
    />
  </div>
</template>

<script>
import MarkerParadaListItem from "./MarkerParadaListItem.vue";

export default {
  name: "MarkerParadaList",

  components: {
    MarkerParadaListItem
  },

  props: {
    paradasMarker: Array
  },

  methods: {
    popupopen(latLngParada) {
      this.$emit("popupopen", latLngParada);
    }
  }
};
</script>
