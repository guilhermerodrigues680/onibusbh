<template>
  <v-bottom-sheet
    v-model="sheet"
    hide-overlay
    scrollable
    content-class="sheet-content"
  >
    <v-card
      color="#0000001f"
    >
      <v-card-text style="height: 33vh;" class="pa-0">
        <v-container fluid class="fill-height">
          <v-row class="flex-nowrap fill-height">
            <v-col
              cols="7"
              sm="3"
              class="text-center pt-0"
              v-if="paradaPrevisao.previsoes.length === 0"
            >
              <v-card
                :ripple="true"
                class="fill-height rounded-lg card-previsao"
              >
                <v-card-text class="pa-0 fill-height">
                  <div class="d-flex flex-column fill-height">
                    <div
                      style="height: 40%; background-color: black"
                      class="text-h2 rounded-lg white--text flex-grow-1 d-flex flex-column justify-center align-center"
                    >
                      <v-icon color="white">mdi-clock-time-eight-outline</v-icon>
                    </div>
                    <div class="text-caption px-2 flex-grow-1 flex-shrink-1 d-flex flex-column justify-center align-center">
                      <div class="">
                        SEM PREVISÕES PARA ESTE PONTO NO MOMENTO
                      </div>
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-center align-center">
                      {{ new Date().toLocaleTimeString('pt-br') }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            <v-col
              cols="7"
              sm="3"
              class="text-center pt-0"
              v-for="prev in paradaPrevisao.previsoes"
              :key="`${prev.codItinerario}-${prev.sgLin}-${prev.prev}`"
              @click="loadItinerarioLinha(prev.codItinerario)"
            >
              <v-card
                :ripple="true"
                class="fill-height rounded-lg card-previsao cursor-pointer"
              >
                <v-card-text class="pa-0 fill-height">
                  <div class="d-flex flex-column fill-height">
                    <div
                      :style="{ height: '40%', 'background-color': getBusColor(prev.cor) }"
                      class="text-h2 rounded-lg white--text flex-grow-1 d-flex flex-column justify-center align-center"
                    >
                      {{ prev.sgLin }}
                    </div>
                    <div class="text-caption px-2 flex-grow-1 flex-shrink-1 d-flex flex-column justify-center align-center">
                      <div class="">
                        {{ prev.apelidoLinha }}
                      </div>
                    </div>
                    <div class="flex-grow-1 d-flex flex-column justify-center align-center">
                      {{ prev.prev }}
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>

            <!-- BOTAO + DETALHES -->
            <v-col
              cols="7"
              sm="3"
              class="text-center pt-0"
              v-if="paradaPrevisao.previsoes.length !== 0"
            >
              <v-card
                :ripple="true"
                class="fill-height rounded-lg card-previsao cursor-pointer"
              >
                <v-card-text class="pa-0 fill-height">
                  <div class="d-flex flex-column fill-height grey rounded-lg white--text">
                    <div class="px-2 text-body-1 flex-grow-1 d-flex flex-column justify-center align-center">
                      <v-icon color="white">mdi-plus-circle-outline</v-icon>
                      MAIS PREVISÕES
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-bottom-sheet>
</template>

<script>
export default {
  name: "SheetPopupPrevissoesParada",

  props: {
    paradaPrevisao: Object
  },

  data: () => ({
    sheet: false,
    model: null,
  }),

  methods: {
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
    loadItinerarioLinha: async function (codItinerario) {
      this.$router.push({ name: 'MapaItinerario', params: { codItinerario } })
    },
  }

}
</script>

<style>
.card-previsao {
  box-shadow: 0px 2px 4px -1px #303F9F33, 0px 4px 5px 0px #303F9F24, 0px 1px 10px 0px #303F9F1f !important;
}

.sheet-content {
  box-shadow: none !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>