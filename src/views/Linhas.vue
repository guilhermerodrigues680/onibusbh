<template>
  <div>
    <v-data-table
      dense
      :headers="headers"
      :items="linhas"
      item-key="name"
      class="elevation-1"
    ></v-data-table>
    <l-map ref="myMap"> </l-map>
  </div>
</template>

<script>
// If you need to reference 'L', such as in 'L.icon', then be sure to
// explicitly import 'leaflet' into your component
import L from 'leaflet';
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';

import { getLinhas } from "../services/onibusbh-api-gateway";

export default {
  name: 'Linhas',
  title: 'Linhas',

  components: {
    LMap,
    LTileLayer,
    LMarker,
  },

  data: () => ({
    headers: [
      { text: 'Código', align: 'start', value: 'cod' },
      { text: 'Nome', /*sortable: false,*/ value: 'nom' },
      { text: 'Sigla', value: 'sgl' },
    ],
    linhas: []
  }),

  created: async function() {
    try {
      const apires = await getLinhas();
      this.linhas = apires.linhas
      console.log('Linhas carregadas')
    } catch (error) {
      console.error('Erro ao carregar linhas')
    }
  }
}
</script>

<style scoped>

</style>
