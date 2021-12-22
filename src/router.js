
import Vue from 'vue'
import Router from 'vue-router'
import Logbook from './views/sites/Logbook.vue'
import Settings from './views/sites/Settings.vue'
import Boats from './views/sites/Boats.vue'
import Reserve from './views/sites/Reserve.vue'
import Statistics from './views/sites/Statistics.vue'
import Damage from './views/sites/Damage.vue'
import Auth from './views/auth/Auth.vue'
import addBoat from './views/forms/addBoat.vue'
import addTour from './views/forms/addTour.vue'
import addReservation from './views/forms/addReservation.vue'


import firebase from 'firebase/app'


Vue.use(Router)

const routes = [
  { path: '*', redirect: '/' },
  { path: '/', name:'logbook', component: Logbook, meta: { requiresAuth: true } },
  { path: '/settings', name:'profil', component: Settings, meta: { requiresAuth: true } },
  { path: '/boats', name:'boats',  component: Boats, meta: { requiresAuth: true } },
  { path: '/reserve', name:'reservations',  component: Reserve, meta: { requiresAuth: true } },
  { path: '/damage/:bid?', name:'damage',  component: Damage, meta: { requiresAuth: true } },
  { path: '/statistics', name:'statistics',  component: Statistics, meta: { requiresAuth: true } },
  { path: '/addboat', name:'addboat',  component: addBoat, meta: { requiresAuth: true } },
  { path: '/addtour', name:'addtour',  component: addTour, meta: { requiresAuth: true } },
  { path: '/addreservation/:bid?', name:'addreservation',  component: addReservation, meta: { requiresAuth: true }, props:false },  
  { path: '/auth', component: Auth, meta: { requiresGuest: true } },
]

const router = new Router({
  routes,
  mode: 'history',
})

router.beforeEach((to, from, next)=> {
  


  //prüfen ob die Seite eine Anmeldung verlangt (requiresAuth == true)
  if(to.matched.some(record => record.meta.requiresAuth)) {
    //prüfen ob  Benutzer angemeldet ist
    if(!firebase.auth().currentUser) {
      next({
        path: '/auth',
        query: {
          redirect: to.fullPath
        }
      })
    } else { 
      
        next()
   
      //next() //Benutzer ist angemeldet => nächste Seite ist ok
    }
  }
  else  if(to.matched.some(record => record.meta.requiresGuest)) {
    if(firebase.auth().currentUser) {
      next({
        path: '/', // Zurück zur vorherigen Seite? 
        /*
        query: {
          redirect: to.fullPath //Zeigt an von welcher Seite man gekommen ist, nachdem man redirected wurde
        }
        */
      })
    } else { 
      next() //Benutzer ist !nicht! angemeldet => nächste Seite ist ok
    }
  }
  else { next() }
})

export default router