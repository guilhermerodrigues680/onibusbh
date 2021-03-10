<template>
  <div>
    <v-list-item>
      <v-list-item-content>
        <v-list-item-title>Navegação</v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider></v-divider>

    <v-list dense>
      <v-list-item
        link
        v-for="link in links"
        :key="link.title"
        :to="link.to"
        color="primary"
        :ripple="{ class: 'primary--text' }"
      >
        <v-list-item-icon>
          <v-icon>{{link.icon}}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{link.title}}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>

<script>
export default {
  name: 'AppNavigation',
  data: () => ({
    links: [
      { icon: "mdi-home", title: "Páginal Inicial", to: "/" },
      { icon: "mdi-map-search-outline", title: "Mapa", to: "/mapa" },
      { icon: "mdi-bus", title: "Linhas", to: "/linhas" },
    //   { icon: "mdi-vector-polyline-plus", title: "Cadastro Classificação Linha", to: "/cadastro-classificacao-linha" },
    //   { icon: "mdi-table-column-plus-after", title: "Cadastro Classificação Pernas", to: "/cadastro-classificacao-pernas" },
    //   { icon: "mdi-view-sequential-outline", title: "Viagens Classificadas", to: "/viagens-classificadas" },
    //   { icon: "mdi-tools", title: "Processamento Conf.", to: "/processamento-config" },
    //   { icon: "mdi-view-dashboard", title: "Foo", to: "/foo" },
    //   { icon: "mdi-plus", title: "Bar", to: "/bar" },
      { icon: "mdi-information-outline", title: "Sobre o App", to: "/about" }
    ]
  })
}
</script>