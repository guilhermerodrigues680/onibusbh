<template>
  <div>
    <v-data-table
      dense
      :headers="headers"
      :items="linhas"
      item-key="name"
      class="elevation-1"
    ></v-data-table>
  </div>
</template>

<script>
import services from "../services";

export default {
  name: 'Linhas',
  title: 'Linhas',

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
      const apires = await services.getLinhas();
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
