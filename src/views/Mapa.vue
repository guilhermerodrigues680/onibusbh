<template>
  <v-container fluid class="fill-height pa-0">
    <v-row class="fill-height">
      <v-col cols="12" class="fill-height py-0">
        <l-map
          class="fill-height"
          :zoom="12"
          :center="center"
          :options="mapOptions"
          @update:center="centerUpdate"
          @update:zoom="zoomUpdate"
          ref="leafletMap"
        >
          <l-tile-layer
            :url="url"
            :attribution="attribution"
          ></l-tile-layer>
          <l-marker
            v-for="parada in paradasMarker"
            :key="parada.cod"
            :lat-lng="parada.latLng"
            :icon="icon"
            @click="loadPrevisoesParada(parada.cod)"
          >
            <!-- <l-popup :content="" -->
            <l-popup>
              <div>{{parada.desc}}</div>
              <div v-if="!paradaPrevisaoTemp.finished">
                Carregando previsões...
              </div>
              <div v-if="paradaPrevisaoTemp.finished && !paradaPrevisaoTemp.sucesso">
                Erro ao carregar previsões...
              </div>
              <div v-if="paradaPrevisaoTemp.finished && paradaPrevisaoTemp.sucesso">
                <div v-if="paradaPrevisaoTemp.previsoes.length === 0">
                  Sem previsões para este ponto
                </div>
                <div v-if="paradaPrevisaoTemp.previsoes.length !== 0">
                  <div
                    v-for="prev in paradaPrevisaoTemp.previsoes"
                    :key="prev"
                    @click="loadItinerarioLinha(prev.codItinerario)"
                  >
                    {{ prev }}
                  </div>
                </div>
              </div>
            </l-popup>
          </l-marker>
        </l-map>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { latLng, Icon, icon } from "leaflet";
import { LMap, LTileLayer, LMarker, LPopup, LTooltip } from "vue2-leaflet";

import services from "../services/index";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Constantes

const iconParada = icon({
  iconUrl: require('../assets/icones-mapa/busstop.png'),
  iconSize: [20, 30],
  iconAnchor: [10, 30],
  shadowUrl: require('../assets/icones-mapa/busstop_shadow.png'),
  shadowAnchor: [6, 50],
  shadowSize: [27,50],
  popupAnchor: [0, -30],
})

export default {
  name: "MapaParadas",
  title: "Mapa Paradas",

  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LTooltip
  },

  data() {
    return {
      zoom: 13,
      center: latLng(-19.9228, -43.9449),
      url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}' + (L.Browser.retina ? '@2x.png' : '.png'),
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>',
      currentZoom: null,
      currentCenter: null,
      paradasMarker: [],
      icon: iconParada,
      mapOptions: {
        zoomSnap: 0.5
      },
      paradaPrevisaoTemp: {
        sucesso: null,
        finished: null,
        previsoes: []
      },
    };
  },

  created: function() {
    this.currentCenter = this.center;
    this.loadParadasProximas();
    // console.log(L)
    // console.log(this.center)
    console.log(this)
    setTimeout(() => this.$refs.leafletMap.mapObject.setView(this.currentCenter, 16), 1250)
  },

  methods: {
    loadParadasProximas: function () {
      return new Promise(async (resolve, reject) => {
        try {
          const apiRes = await services.getParadasProximas(this.currentCenter.lng, this.currentCenter.lat);
          const paradas = apiRes.paradas.map(p => ({ ...p, latLng: latLng(p.y, p.x) }))
          this.paradasMarker.splice(0)
          this.paradasMarker.push(...paradas)
          resolve(apiRes.paradas)
        } catch (error) {
          reject(error)
        }
      })
    },
    loadPrevisoesParada: async function (codParada) {
      this.paradaPrevisaoTemp.previsoes.splice(0)
      this.paradaPrevisaoTemp.finished = false
      this.paradaPrevisaoTemp.sucesso = null
      const apiRes = await services.getPrevisoesParada(codParada)
      this.paradaPrevisaoTemp.previsoes.push(...apiRes.previsoes)
      this.paradaPrevisaoTemp.finished = true
      this.paradaPrevisaoTemp.sucesso = true
    },
    loadItinerarioLinha: async function (codItinerario) {
      const apiRes = await services.getItinerario(codItinerario)
      const apiRes2 = await services.getVeiculosMapa(codItinerario)
    },
    zoomUpdate(zoom) {
      this.currentZoom = zoom;
    },
    centerUpdate(center) {
      this.currentCenter = center;
      this.loadParadasProximas()
    },
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    }
  }
};
</script>