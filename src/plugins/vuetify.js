import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import pt from 'vuetify/lib/locale/pt';
import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify);

// https://vuetifyjs.com/en/features/theme/#customizing

export default new Vuetify({
  lang: {
    locales: { pt },
    current: 'pt',
  },
  theme: {
    themes: {
      light: {
        // primary: '#1976D2',
        // secondary: '#424242',
        // accent: '#82B1FF',
        // error: '#FF5252',
        // info: '#2196F3',
        // success: '#4CAF50',
        // warning: '#FFC107',
        primary: colors.indigo.darken2,
        secondary: colors.grey.darken3,
        accent: colors.indigo.accent1,
        error: colors.red.accent2,
        info: colors.indigo,
        success: colors.green,
        warning: colors.amber,
      },
    },
  },
});
