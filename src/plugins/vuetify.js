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
        success: '#06d6a0',
        dark: '#363636',
        darkbg: '#161616'
      },
    },
  },
})





export default vuetify
