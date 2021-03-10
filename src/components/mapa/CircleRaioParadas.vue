<template>
  <l-circle
    :lat-lng="circleCenter"
    :radius="500"
    color="#3F51B5"
    :fill="false"
    :opacity="0.65"
  />
</template>

<script>
import { LCircle } from "vue2-leaflet";

export default {
  name: "CircleRaioParadas",

  components: {
    LCircle,
  },

  props: {
    circleCenter: Array
  }

}
</script>

<style>

</style>