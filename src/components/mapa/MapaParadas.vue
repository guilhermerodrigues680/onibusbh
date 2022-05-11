<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height py-0">
        <l-map
          class="fill-height"
          :zoom.sync="currentZoom"
          :center.sync="currentCenter"
          :options="mapOptions"
          :minZoom="11"
          ref="leafletMap"
          style="z-index: 0;"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <CircleRaioParadas :circleCenter="currentCenter" />
          <GeoJsonAreaBH />
          <MarkerVeiculo :veiculos="veiculosMarker" />
          <MarkerParadaList :paradasMarker="paradasMarker" @popupopen="popupopen" />
          <MarkerUserPosition v-if="!!userPosition" :userPositionLatLng="userPosition" />
        </l-map>
      </v-col>
    </v-row>

    <v-fab-transition>
      <v-btn
        color="red"
        fab
        large
        dark
        bottom
        right
        fixed
        class="v-btn--example"
        @click="goToUserPosition"
      >
        <v-icon>mdi-crosshairs-gps</v-icon>
      </v-btn>
    </v-fab-transition>

    <v-overlay :value="loading">
      <v-progress-circular indeterminate size="64"></v-progress-circular>
    </v-overlay>
  </v-container>
</template>

<script>
import { LatLng, latLng } from "leaflet";
import { LMap, LTileLayer } from "vue2-leaflet";

import { getParadasProximas, getVeiculosProximos } from "../../services/onibusbh-api-gateway";
import MarkerParadaList from "./MarkerParadaList.vue";
import MarkerUserPosition from "./MarkerUserPosition.vue";
import MarkerVeiculo from "../mapa-itinerario/MarkerVeiculo.vue";
import GeoJsonAreaBH from "./GeoJsonAreaBH.vue";
import CircleRaioParadas from "./CircleRaioParadas.vue";
import Tracker from "./js/Tracker";
import alerts from "@/services/alerts";

const MIN_ZOOM = 14;
const tracker = new Tracker();

export default {
  name: "MapaParadas",

  components: {
    LMap,
    LTileLayer,
    MarkerParadaList,
    GeoJsonAreaBH,
    CircleRaioParadas,
    MarkerUserPosition,
    MarkerVeiculo
  },

  data: () => ({
    currentZoom: 13,
    /** @type {LatLng} */
    currentCenter: latLng(-19.9228, -43.9449),

    url:
      "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}" +
      (L.Browser.retina ? "@2x.png" : ".png"),
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
    mapOptions: {
      zoomSnap: 0.5
    },

    paradasMarker: [],
    veiculosMarker: [],

    /** @type {LatLng} */
    userPosition: null,
    loading: true,

    loadingStopMarkers: false,
    loadingVehicleMarkers: false
  }),

  watch: {
    currentCenter(newVal, oldVal) {
      // Isso pode ocorrer, pois pode ser alteração de referencia do objeto
      if (newVal.lat == oldVal.lat && newVal.lng == oldVal.lng) {
        return;
      }

      //https://stackoverflow.com/questions/62462276/how-to-solve-avoided-redundant-navigation-to-current-location-error-in-vue
      const { lat: latQuery, lng: lngQuery } = this.$route.query;
      if (+newVal.lat !== +latQuery && +newVal.lng !== +lngQuery) {
        this.$router.replace({ name: "Mapa", query: { lat: newVal.lat, lng: newVal.lng } });
      }

      if (this.currentZoom < MIN_ZOOM) {
        return;
      }

      this.loadMapMarkers();
    },

    currentZoom(newVal, oldVal) {
      if (newVal < MIN_ZOOM) {
        this.paradasMarker.splice(0);
        this.veiculosMarker.splice(0);
        return;
      }

      // reativa icones
      if (oldVal < MIN_ZOOM && newVal >= MIN_ZOOM) {
        this.loadMapMarkers();
      }
    }
  },

  async created() {
    let { lat, lng } = this.$route.query;
    if (lat === undefined && lng === undefined) {
      if (Tracker.HAS_GEOLOCATION) {
        this.goToUserPosition();
        this.loading = false;
        return;
      }

      alerts.fireToastError("Erro ao obter sua posição", "Seu dispositivo não fornece localização");
    }

    this.currentCenter = latLng(lat, lng);
    setTimeout(() => {
      this.$refs.leafletMap.mapObject.setView(this.currentCenter, 16);
      this.loading = false;
    }, 1250);
  },

  mounted() {
    // https://v2.vuejs.org/v2/guide/components-edge-cases.html#Programmatic-Event-Listeners
    tracker.on(Tracker.EVS.positionUpdate, this.handlePositionUpdate);
    tracker.on(Tracker.EVS.errorGettingPosition, this.handleErrorPosition);
    tracker.start();

    this.$once("hook:beforeDestroy", () => {
      tracker.off(Tracker.EVS.positionUpdate, this.handlePositionUpdate);
      tracker.off(Tracker.EVS.errorGettingPosition, this.handleErrorPosition);
      tracker.stop();
    });
  },

  methods: {
    loadMapMarkers() {
      this.loadParadasProximas(this.currentCenter), this.loadVeiculosProximos(this.currentCenter);
    },

    async loadParadasProximas(center) {
      if (this.loadingStopMarkers) {
        return;
      }

      let paradas;
      try {
        this.loadingStopMarkers = true;
        ({ paradas } = await getParadasProximas(center.lat, center.lng));
      } finally {
        this.loadingStopMarkers = false;
      }

      // const paradas = apiRes.paradas.map(p => ({ ...p, latLng: latLng(p.y, p.x) }));

      // Cada parada é identificada pelo atributo 'cod'
      // Remove as paradas que nao estao na resposta da api
      const codsRes = paradas.map(p => p.cod);
      const codsMarker = this.paradasMarker.map(p => p.cod);
      for (const codMarker of codsMarker) {
        if (!codsRes.includes(codMarker)) {
          const idx = this.paradasMarker.findIndex(p => p.cod === codMarker);
          this.paradasMarker.splice(idx, 1);
        }
      }

      // Mantem as paradas que já estao no array
      // Inclui somente as paradas que não estavam no array
      const paradasNovas = paradas.filter(p => !codsMarker.includes(p.cod));
      paradasNovas.forEach(p => {
        this.paradasMarker.push(p);
      });

      return paradas;
    },

    async loadVeiculosProximos(center) {
      if (this.loadingVehicleMarkers) {
        return;
      }

      try {
        this.loadingVehicleMarkers = true;
        const { veicList: veiculos } = await getVeiculosProximos(center.lat, center.lng);
        this.$set(this.$data, "veiculosMarker", veiculos);
      } finally {
        this.loadingVehicleMarkers = false;
      }
    },

    popupopen(latLngParada) {
      this.currentCenter = latLngParada;
    },

    async goToUserPosition() {
      try {
        const { lat, lng } = await tracker.getCurrentPosition();
        if (!this.userPosition && (!lat || !lng)) {
          alerts.fireToastError("Sua localização está desativada");
          return;
        }
        this.userPosition = latLng(lat, lng);
        this.currentCenter = latLng(this.userPosition.lat, this.userPosition.lng);
        this.$refs.leafletMap.mapObject.setView(this.currentCenter, 16);
      } catch (error) {
        alerts.fireToastError("Erro ao obter sua posição", error.message);
      }
    },

    /** @param {GeolocationPosition} event */
    handlePositionUpdate(event) {
      this.userPosition = latLng(event.coords.latitude, event.coords.longitude);
    },

    /** @param {GeolocationPositionError} event */
    handleErrorPosition(event) {
      // TODO: traduzir mensagem de erro
      alerts.fireToastError("Erro ao obter sua posição", event.message);
    }
  }
};
</script>

<style lang="scss" scoped>
.v-btn--example {
  // bottom: 0;
  // position: absolute;
  margin: 1rem;
}
</style>
