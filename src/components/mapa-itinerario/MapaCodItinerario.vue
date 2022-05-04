<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height py-0">
        <l-map
          class="fill-height"
          :zoom="startingZoom"
          :center.sync="startingCenter"
          :options="mapOptions"
          :minZoom="11"
          ref="leafletMap"
          style="z-index: 0;"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <l-polyline :lat-lngs="polylineLatlngsStart" :color="polylineColorStart" />
          <l-polyline :lat-lngs="polylineLatlngsEnd" :color="polylineColorEnd" />
          <MarkerVeiculo :veiculos="veiculos" />
          <MarkerParadaListItem v-if="parada" :parada="parada" />
          <MarkerInicioItinerario :coords="startCoordItinerario" />
          <MarkerFimItinerario :coords="endCoordItinerario" />
          <GeoJsonAreaBH />
        </l-map>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { latLng } from "leaflet";
import { getVeiculosMapa } from "../../services/onibusbh-api-gateway";

import { LMap, LTileLayer, LPolyline } from "vue2-leaflet";
import GeoJsonAreaBH from "../mapa/GeoJsonAreaBH.vue";
import MarkerVeiculo from "./MarkerVeiculo.vue";
import MarkerParadaListItem from "@/components/mapa/MarkerParadaListItem.vue";
import MarkerInicioItinerario from "@/components/mapa-itinerario/MarkerInicioItinerario.vue";
import MarkerFimItinerario from "@/components/mapa-itinerario/MarkerFimItinerario.vue";

export default {
  name: "MapaCodItinerario",

  components: {
    LMap,
    LTileLayer,
    LPolyline,
    GeoJsonAreaBH,
    MarkerVeiculo,
    MarkerParadaListItem,
    MarkerInicioItinerario,
    MarkerFimItinerario
  },

  props: {
    itinerarios: Array,
    codItinerario: String,
    parada: Object
  },

  data: () => ({
    startingZoom: 13,
    startingCenter: latLng(-19.9228, -43.9449),
    url:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}" +
      (L.Browser.retina ? "@2x.png" : ".png"),
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    mapOptions: {
      zoomSnap: 0.5
    },
    veiculos: [],
    polylineColorStart: "#4CAF50",
    polylineColorEnd: "#41576e"
  }),

  computed: {
    polylineLatlngsStart() {
      const minLatLngIdx = this.calculaPontoProximoAoPonto();
      return this.itinerarios.slice(0, minLatLngIdx + 1).map(c => [c.coordY, c.coordX]);
    },
    polylineLatlngsEnd() {
      const minLatLngIdx = this.calculaPontoProximoAoPonto();
      return this.itinerarios.slice(minLatLngIdx).map(c => [c.coordY, c.coordX]);
    },
    startCoordItinerario() {
      const coord = this.itinerarios[0];
      return { lat: coord.coordY, long: coord.coordX };
    },
    endCoordItinerario() {
      const coord = this.itinerarios[this.itinerarios.length - 1];
      return { lat: coord.coordY, long: coord.coordX };
    }
  },

  watch: {
    itinerarios(val) {
      if (!val.length) {
        return;
      }

      // Para calcular o ponto central, basta achar a media das coordenadas
      const sumCoordsY = val.reduce((acumulador, coord) => acumulador + coord.coordY, 0);
      const sumCoordsX = val.reduce((acumulador, coord) => acumulador + coord.coordX, 0);
      const pCenterY = sumCoordsY / val.length;
      const pCenterX = sumCoordsX / val.length;
      this.startingCenter = latLng(pCenterY, pCenterX);
    }
  },

  created() {
    this.loadVeiculosMapa();
    const intervalUpdate = setInterval(() => this.loadVeiculosMapa(), 3000);
    this.$once("hook:beforeDestroy", () => clearInterval(intervalUpdate));
  },

  methods: {
    async loadVeiculosMapa() {
      const { veiculos } = await getVeiculosMapa(this.codItinerario);
      this.$set(this.$data, "veiculos", veiculos);
    },

    calculaPontoProximoAoPonto() {
      // TODO: Refatorar esse metodo
      if (!this.parada) {
        return;
      }

      // Para achar qual é a coordenada mais próxima do ponto,
      // inicia-se interando sobre o itinerário até achar o menor index e a menor distância
      const paradaLatLng = latLng(this.parada.y, this.parada.x);

      /** @type {import("leaflet").LatLng} */
      let minLatLng = null;
      let minLatLngIdx = -1;
      for (const [idx, coord] of this.itinerarios.entries()) {
        const { coordY: lat, coordX: long } = coord;
        const coordLatLng = latLng(lat, long);
        if (!minLatLng) {
          minLatLng = coordLatLng;
          minLatLngIdx = idx;
          continue;
        }

        const dMinCoord = paradaLatLng.distanceTo(minLatLng);
        const dCoord = paradaLatLng.distanceTo(coordLatLng);
        if (dCoord <= dMinCoord) {
          minLatLng = coordLatLng;
          minLatLngIdx = idx;
        }
      }

      return minLatLngIdx;
    }
  }
};
</script>
