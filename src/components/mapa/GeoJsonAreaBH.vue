<template>
  <l-geo-json :geojson="geojson" :options="geojsonOptions"></l-geo-json>
</template>

<script>
import { LGeoJson } from "vue2-leaflet";

export default {
  name: "GeoJsonAreaBH",

  components: {
    LGeoJson,
  },

  data: () => ({
    geojson: null,
    geojsonOptions: {
      style: {
        color: "#3F51B5",
        weight: 3,
        opacity: 0.65,
        fill: false
      }
    }
  }),

  created: async function () {
    const areaBHRes = await fetch('./geojson/area-belohorizonte.geojson')
    const areaBH = await areaBHRes.json()
    console.log(areaBH)
    this.geojson = areaBH
  }
}
</script>

<style>

</style>