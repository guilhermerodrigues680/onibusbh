<template>
  <div>
    <l-marker
      v-for="parada in paradasMarker"
      :key="parada.cod"
      :lat-lng="parada.latLng"
      :icon="icon"
      @click="loadPrevisoesParada(parada.cod)"
    >
      <!-- <l-popup :content="" -->
      <l-popup
        ref="leafletPopup"
      >
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
              :key="`${prev.codItinerario}-${prev.sgLin}-${prev.prev}`"
              @click="loadItinerarioLinha(prev.codItinerario)"
            >
              {{ prev.sgLin }} - {{ prev.prev }}
            </div>
          </div>
        </div>
      </l-popup>
    </l-marker>
  </div>
</template>

<script>
import { icon, Icon } from "leaflet";
import services from "../../services/index";

import { LMarker, LPopup } from "vue2-leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: "MarkerParada",

  components: {
    LMarker,
    LPopup
  },

  props: {
    paradasMarker: Array
  },

  data: () => ({
    paradaPrevisaoTemp: {
      sucesso: null,
      finished: null,
      previsoes: []
    },
    icon: icon({
      iconUrl: require('../../assets/icones-mapa/busstop.png'),
      iconSize: [20, 30],
      iconAnchor: [10, 30],
      shadowUrl: require('../../assets/icones-mapa/busstop_shadow.png'),
      shadowAnchor: [6, 50],
      shadowSize: [27,50],
      popupAnchor: [0, -30],
    }),
  }),

  methods: {
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
  }
}
</script>

<style>

</style>