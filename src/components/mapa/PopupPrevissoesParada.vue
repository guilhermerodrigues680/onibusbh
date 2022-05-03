<template>
  <l-popup>
    <div>{{ parada.desc }}</div>
    <SheetPopupPrevissoesParada
      ref="sheetPopup"
      :paradaPrevisao="paradaPrevisaoTemp"
      :codParada="parada.cod"
    />
  </l-popup>
</template>

<script>
import { latLng } from "leaflet";
import { getPrevisoesParada } from "../../services/onibusbh-api-gateway";

import { LPopup } from "vue2-leaflet";
import SheetPopupPrevissoesParada from "./SheetPopupPrevissoesParada.vue";

export default {
  name: "PopupPrevissoesParada",

  components: {
    LPopup,
    SheetPopupPrevissoesParada
  },

  props: {
    parada: Object
  },

  data: () => ({
    paradaPrevisaoTemp: {
      sucesso: null,
      finished: null,
      previsoes: []
    }
  }),

  created: function() {
    this.$parent.mapObject.on("popupopen", async e => {
      await this.loadPrevisoesParada(this.parada.cod);
      this.$parent.mapObject.openPopup();
      this.$refs.sheetPopup.sheet = true;
      console.log("this", this);
      this.$emit("popupopen", latLng(this.parada.y, this.parada.x));
    });
    this.$parent.mapObject.on("popupclose", e => {
      // this.$refs.sheetPopup.sheet = false
    });
  },

  methods: {
    loadPrevisoesParada: function(codParada) {
      return new Promise(async (resolve, reject) => {
        this.paradaPrevisaoTemp.previsoes.splice(0);
        this.paradaPrevisaoTemp.finished = false;
        this.paradaPrevisaoTemp.sucesso = null;
        const apiRes = await getPrevisoesParada(codParada);
        this.paradaPrevisaoTemp.previsoes.push(...apiRes.previsoes);
        this.paradaPrevisaoTemp.finished = true;
        this.paradaPrevisaoTemp.sucesso = true;
        resolve();
      });
    }
  }
};
</script>
