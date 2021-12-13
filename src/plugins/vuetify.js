import Vue from 'vue'
import Vuetify from 'vuetify/lib'


Vue.use(Vuetify)

const vuetify = new Vuetify({
  iconfont: 'md',
  theme: {
    dark: true,
    themes: {
      dark: {
        primary: '#FFFFFF',
        secondary: '#5c677d',
        error: '#d7263d',
        warning: '#e59500',
        success: '#06d6a0'

      },
    },
  },
})





export default vuetify
