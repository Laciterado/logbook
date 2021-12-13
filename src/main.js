import Vue from 'vue'
import vuetify from './plugins/vuetify'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/app'
import store from "@/store/store"

Vue.config.productionTip = false

let app = '';

firebase.auth().onAuthStateChanged(() => {
  if(!app) {
    app = new Vue({
      el: '#app',
      router,
      vuetify,
      store,
      render: h => h(App)
    }).$mount('#app')
  }

});


