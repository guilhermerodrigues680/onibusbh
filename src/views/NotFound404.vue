<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h1>Opsss...</h1>

        <p>Página não encontrada.</p>

        <p><router-link to="/">Voltar para a página inicial</router-link></p>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  name: 'NotFound404',
  title: 'Página não encontrada'
}
</script>
