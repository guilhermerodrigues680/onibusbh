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
          @update:center="zoomOrCenterUpdate($event, null)"
          @update:zoom="zoomOrCenterUpdate(null, $event)"
          ref="leafletMap"
          style="z-index: 0;"
        >
          <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
          <CircleRaioParadas :circleCenter="circleCenter" />
          <GeoJsonAreaBH />
          <MarkerParada :paradasMarker="paradasMarker" @popupopen="popupopen" />
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

import { getParadasProximas } from "../../services/onibusbh-api-gateway";
import MarkerParada from "./MarkerParada.vue";
import MarkerUserPosition from "./MarkerUserPosition.vue";
import GeoJsonAreaBH from "./GeoJsonAreaBH.vue";
import CircleRaioParadas from "./CircleRaioParadas.vue";
import * as geolocation from "./js/geolocation";
import Tracker from "./js/Tracker";
import alerts from "@/services/alerts";

const tracker = new Tracker();

export default {
  name: "MapaParadas",

  components: {
    LMap,
    LTileLayer,
    MarkerParada,
    GeoJsonAreaBH,
    CircleRaioParadas,
    MarkerUserPosition
  },

  data() {
    return {
      startingZoom: 13,
      // TODO: Refatorar os usos de startingCenter pois agora há o modificador sync
      startingCenter: latLng(-19.9228, -43.9449),
      url:
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}" +
        (L.Browser.retina ? "@2x.png" : ".png"),
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      mapOptions: {
        zoomSnap: 0.5
      },
      paradasMarker: [],
      circleCenter: [],
      currentCenterAndZoom: {
        zoom: null,
        center: null
      },
      /** @type {LatLng} */
      userPosition: null,
      loading: true
    };
  },

  created: async function() {
    let { lat, lng } = this.$route.query;
    if (lat === undefined && lng === undefined) {
      // TODO: reusar funcao goToUserPosition
      if (geolocation.HAS_GEOLOCATION) {
        console.debug("browser suporta geolocation");
        try {
          const res = await geolocation.getCurrentPosition();
          console.debug(res);
          const ll = latLng(res.coords.latitude, res.coords.longitude);
          await this.zoomOrCenterUpdate(ll, this.startingZoom);
          this.userPosition = ll;
        } catch (error) {
          console.error(error);
          alert(error.message);
          await this.zoomOrCenterUpdate(this.startingCenter, this.startingZoom);
        }
      } else {
        console.error("Your browser doesn't support Geolocation");
        await this.zoomOrCenterUpdate(this.startingCenter, this.startingZoom);
      }
    } else {
      await this.zoomOrCenterUpdate(latLng(lat, lng), this.startingZoom);
    }
    setTimeout(() => {
      this.$refs.leafletMap.mapObject.setView(this.currentCenterAndZoom.center, 16);
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
    loadParadasProximas(center) {
      return new Promise(async (resolve, reject) => {
        try {
          const apiRes = await getParadasProximas(center.lat, center.lng);
          const paradas = apiRes.paradas.map(p => ({ ...p, latLng: latLng(p.y, p.x) }));

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

          resolve(paradas);
        } catch (error) {
          reject(error);
        }
      });
    },
    zoomOrCenterUpdate(center, zoom) {
      return new Promise(async (resolve, reject) => {
        // const oldCenter = this.currentCenterAndZoom.center
        this.currentCenterAndZoom.center =
          center !== null ? center : this.currentCenterAndZoom.center;
        this.currentCenterAndZoom.zoom = zoom !== null ? zoom : this.currentCenterAndZoom.zoom;

        // Caso seja uma atualizacao somente do zoom
        if (center === null && zoom !== null) {
          if (zoom < 14) {
            this.paradasMarker.splice(0);
          }
          resolve();
          return;
        }

        //https://stackoverflow.com/questions/62462276/how-to-solve-avoided-redundant-navigation-to-current-location-error-in-vue

        const { lat: latCurrent, lng: lngCurrent } = this.currentCenterAndZoom.center;
        const { lat: latQuery, lng: lngQuery } = this.$route.query;
        if (+latCurrent !== +latQuery && +lngCurrent !== +lngQuery) {
          this.$router.replace({ name: "Mapa", query: { ...this.currentCenterAndZoom.center } });
        }

        // TODO: Checar se o centro mudou para enviar uma nova requisicao
        // const p = p => JSON.parse(JSON.stringify(p))
        // const round5 = (x) => Math.round(x * 1e5)/1e5;

        // try {
        //  console.debug(round5(oldCenter.lat), round5(center.lat))
        //   console.debug(round5(oldCenter.lng), round5(center.lng))
        // } catch(e) {
        //   console.debug(e)
        // }

        // // Caso seja uma atualiazacao de centro e/ou zoom
        // if (oldCenter !== null && oldCenter.lat === center.lat && oldCenter.lng === center.lng) {
        //   console.debug("Não mudou o centro")
        //   return
        // }

        this.circleCenter.splice(
          0,
          this.circleCenter.length,
          ...[this.currentCenterAndZoom.center.lat, this.currentCenterAndZoom.center.lng]
        );

        if (this.currentCenterAndZoom.zoom >= 14) {
          await this.loadParadasProximas(this.currentCenterAndZoom.center);
          resolve();
        } else {
          this.paradasMarker.splice(0);
          resolve();
        }
      });
    },
    popupopen: function(latLngParada) {
      this.startingCenter = latLngParada;
    },

    goToUserPosition() {
      if (!this.userPosition) {
        alerts.fireToastError("Sua localização está desativada");
        return;
      }

      this.startingCenter = latLng(this.userPosition.lat, this.userPosition.lng);
    },

    /** @param {GeolocationPosition} event */
    handlePositionUpdate(event) {
      console.debug("handlePositionUpdate", event);
      this.userPosition = latLng(event.coords.latitude, event.coords.longitude);
    },

    /** @param {GeolocationPositionError} event */
    handleErrorPosition(event) {
      console.debug("handleErrorPosition", event);
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
