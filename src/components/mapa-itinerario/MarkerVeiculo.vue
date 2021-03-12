<template>
  <div>
    <l-marker
      v-for="veiculo in veiculos"
      :key="veiculo.numVeicGestor"
      :lat-lng="[veiculo.lat, veiculo.long]"
      :icon="getBusIcon(veiculo.cor)"
    >
      <l-popup class="text-center">
        <div
          :style="{ 'background-color': getBusColor(veiculo.cor) }"
          class="text-h6 rounded-lg"
        >
          {{ veiculo.descricao }}
        </div>
        <div class="text-caption">N.º Veiculo: {{ veiculo.numVeicGestor }}</div>
        <div class="text-caption">Atualização: {{ new Date().toLocaleTimeString('pt-br') }}</div>
      </l-popup>
    </l-marker>
  </div>
</template>

<script>
import { icon, Icon } from "leaflet";

import { LMarker, LPopup } from "vue2-leaflet";

delete Icon.Default.prototype._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

export default {
  name: "MarkerVeiculo",

  components: {
    LMarker,
    LPopup,
  },

  props: {
    veiculos: Array
  },

  data: () => ({
    //
  }),

  methods: {
    getBusIcon: function (cor) {
      const iconOptions = {
        iconUrl: require(`../../assets/icones-mapa/busicon_${cor}.png`),
        iconSize: [18, 20],
        iconAnchor: [9, 10],
        popupAnchor: [0, 0]
      }
      return icon(iconOptions)
    },
    getBusColor: function (numColor) {
      const busColors = {
        1: '#d8d8d8', // 1 Branco/Cinza Claro
        2: '#363435', // 2 Cinza Escuro/Preto
        3: '#878787', // 3 Cinza
        4: '#3898d4', // 4 Azul (Claro)
        5: '#1e5c86', // 5 Azul
        6: '#73327f', // 6 Roxo
        7: '#ed3c62', // 7 Rosa
        8: '#fff551', // 8 Amarelo
        9: '#facd48', // 9 Amarelo Âmbar/Laranja
        10: '#d83335', // 10 Vermelho
        11: '#aaf545', // 11 Verde/Move
        12: '#60be34', // 12 Verde
        13: '#f1853b', // 13 Laranja
      };
      return busColors[numColor]
    },
  }
  
}
</script>