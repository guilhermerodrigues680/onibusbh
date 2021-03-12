<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height py-0">
        <l-map
          class="fill-height"
          :zoom="startingZoom"
          :center="startingCenter"
          :options="mapOptions"
          :minZoom="11"
          ref="leafletMap"
          style="z-index: 0;"
        >
          <l-tile-layer
            :url="url"
            :attribution="attribution"
          ></l-tile-layer>
          <l-polyline
            :lat-lngs="polyline.latlngs"
            :color="polyline.color"
          />
          <MarkerVeiculo :veiculos="veiculos" />
          <GeoJsonAreaBH />
        </l-map>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { latLng } from "leaflet";
import services from "../../services/index";

import { LMap, LTileLayer, LPolyline } from "vue2-leaflet";
import GeoJsonAreaBH from "../mapa/GeoJsonAreaBH.vue";
import MarkerVeiculo from "./MarkerVeiculo.vue";

export default {
  name: "MapaCodItinerario",

  components: {
    LMap,
    LTileLayer,
    LPolyline,
    GeoJsonAreaBH,
    MarkerVeiculo
  },

  props: {
    itinerarios: Array,
    codItinerario: String
  },

  data: () => ({
    startingZoom: 13,
    startingCenter: latLng(-19.9228, -43.9449),
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'),
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    mapOptions: {
      zoomSnap: 0.5
    },
    polyline: {
      latlngs: [],
      color: "#4CAF50"
    },
    veiculos: [],
    intervalUpdate: null
  }),

  watch: {
    itinerarios: function (val) {
      console.log(val, this.itinerarios)
      const latlngsItinerarios = this.itinerarios.map(c => [ c.coordY, c.coordX ])
      this.polyline.latlngs.splice(0)
      latlngsItinerarios.forEach(latlng => this.polyline.latlngs.push(latlng))
    }
  },

  created: async function () {
    console.log(this)
    await this.loadVeiculosMapa()
    this.intervalUpdate = setInterval(() => this.loadVeiculosMapa(), 3000)
  },

  beforeDestroy: function () {
    if (this.intervalUpdate !== null) {
      clearInterval(this.intervalUpdate)
    }
  },

  methods: {
    loadVeiculosMapa: async function () {
      const apiResVeiculos = await services.getVeiculosMapa(this.codItinerario)
      this.veiculos.splice(0)
      apiResVeiculos.veiculos.forEach(v => this.veiculos.push(v))
    }
  }

}
</script>
