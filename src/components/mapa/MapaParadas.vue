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
          @update:center="zoomOrCenterUpdate($event, null)"
          @update:zoom="zoomOrCenterUpdate(null, $event)"
          ref="leafletMap"
        >
          <l-tile-layer
            :url="url"
            :attribution="attribution"
          ></l-tile-layer>
          <CircleRaioParadas :circleCenter="circleCenter"/>
          <GeoJsonAreaBH />
          <MarkerParada :paradasMarker="paradasMarker" />
        </l-map>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer } from "vue2-leaflet";

import services from "../../services/index";
import MarkerParada from "./MarkerParada.vue";
import GeoJsonAreaBH from "./GeoJsonAreaBH.vue";
import CircleRaioParadas from "./CircleRaioParadas.vue";

export default {
  name: "MapaParadas",

  components: {
    LMap,
    LTileLayer,
    MarkerParada,
    GeoJsonAreaBH,
    CircleRaioParadas
  },

  data() {
    return {
      startingZoom: 13,
      startingCenter: latLng(-19.9228, -43.9449),
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'),
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      mapOptions: {
        zoomSnap: 0.5
      },
      paradasMarker: [],
      circleCenter: [],
      currentCenterAndZoom: {
        zoom: null,
        center: null
      },
    };
  },

  created: async function() {
    await this.zoomOrCenterUpdate(this.startingCenter, this.startingZoom)
    setTimeout(() => this.$refs.leafletMap.mapObject.setView(this.startingCenter, 16), 1250)
  },

  methods: {
    loadParadasProximas(center) {
      return new Promise(async (resolve, reject) => {
        try {
          const apiRes = await services.getParadasProximas(center.lng, center.lat);
          const paradas = apiRes.paradas.map(p => ({ ...p, latLng: latLng(p.y, p.x) }))
          this.paradasMarker.splice(0)
          this.paradasMarker.push(...paradas)
          resolve(apiRes.paradas)
        } catch (error) {
          reject(error)
        }
      })
    },
    zoomOrCenterUpdate(center, zoom) {
      return new Promise(async (resolve, reject) => {
        this.currentCenterAndZoom.center = center !== null ? center : this.currentCenterAndZoom.center
        this.currentCenterAndZoom.zoom = zoom !== null ? zoom : this.currentCenterAndZoom.zoom

        // Caso seja uma atualizacao somente do zoom
        if (center === null && zoom !== null) {
          if (zoom < 14) {
            this.paradasMarker.splice(0)
          }
          resolve()
          return
        }

        this.circleCenter.splice(0)
        this.circleCenter.push(...[this.currentCenterAndZoom.center.lat, this.currentCenterAndZoom.center.lng])

        if (this.currentCenterAndZoom.zoom >= 14) {
          await this.loadParadasProximas(this.currentCenterAndZoom.center)
          resolve()
        } else {
          this.paradasMarker.splice(0)
          resolve()
        }
      })
    }
  }
};
</script>