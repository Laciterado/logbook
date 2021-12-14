<template>
<div>

  <v-navigation-drawer
  
    v-model="drawer"
    fixed
    left
    temporary
    app
  >

    <template v-slot:prepend>
      <div class="d-none d-sm-block">
        <v-flex class="pt-6 d-flex justify-content align-center flex-column">
          <v-avatar size="130">
            <img :src="photoURL">
          </v-avatar>
          <p class="subheading ma-0 pt-6">
            {{ user.firstname + ' ' + user.lastname}}
          </p>
        </v-flex>
      </div>
      <v-flex class="pt-8 pb-8 px-8">
        <v-btn block color="success" elevation="0">
        Fahrt beginnen
      </v-btn>
      </v-flex>
    </template>

  <v-container class="pa-0 ma-0">

 
  
    <v-list class="pa-0 ma-0">
      <v-list-item
        v-for="item in links"
        :key="item.route"
        link
        :to="item.route"
        class="ma-0 px-8"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="text-right">{{ item.text }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
    </v-container>

  
    <template v-slot:append >
      <div class="pb-8 px-8 pt-6">
        <v-btn block @click="signout()" color="error" elevation="0">
          Abmelden
        </v-btn>
      </div>
    </template>


    </v-navigation-drawer>

    <v-app-bar dense fixed app elevate-on-scroll>

        <v-app-bar-nav-icon @click.stop="drawer = !drawer" v-if="allowedSite"></v-app-bar-nav-icon>

  
        <v-btn v-if="!allowedSite" icon @click="back()"><v-icon>chevron_left</v-icon></v-btn>
        <span v-if="!allowedSite" class="font-weight-light text-uppercase pl-2 d-none d-sm-block hover" @click="back()">ZURÜCK</span>

        <span class="font-weight-light text-uppercase pl-2 d-none d-sm-block" v-if="allowedSite">{{ this.$route.name}}</span>
          
          
          


  
        <v-spacer></v-spacer>
        <v-btn v-show="route === '/'" icon :to="'/addtour'"><v-icon >add</v-icon></v-btn>


       
        <!---
        
        <span v-if="route === '/addboat'" class="font-weight-light text-uppercase hover ml-3 mr-1 d-none d-sm-block">WEITER</span>
        <v-btn v-if="route === '/addboat'" icon elevation="0" small class="ma-0 pa-0 ml-3 mr-1"><v-icon >chevron_right</v-icon></v-btn>


     
        <v-btn v-show="route === '/'" v-bind="attrs" v-on="on" icon elevation="0" class="ma-0 pa-0 ml-3" :to="'/addtour'"><v-icon dense>play_arrow</v-icon></v-btn>
  

        <v-btn v-show="route === '/boats'" v-bind="attrs" v-on="on" icon elevation="0" class="ma-0 pa-0 ml-3" :to="'/addboat'" ><v-icon dense>add</v-icon></v-btn>



         <v-btn v-show="route === '/boats'" v-bind="attrs" v-on="on" icon elevation="0" class="ma-0 pa-0 ml-3"><v-icon dense @click="resetSearch()">search</v-icon></v-btn>

        --->


      <template v-slot:extension v-if="searchBar">

        <v-text-field
        autofocus
        v-model="search"
        label="Boot suchen"
        append-icon='close'
        @click:append="resetSearch()"
        single-line
        hide-details
        @input="setSearchInput()"
        
      ></v-text-field>
    
      </template>


    </v-app-bar>


</div>

</template>

<script>

import firebase from "firebase/app"


export default {
  data: () => ({
    newroute: '',
    oldroute: '',
    search: '',
    searchBar: false,
    user: [],
    drawer: false,
    group: null,
    photoURL: "https://imgur.com/dLB4u3s.png",
    links: [
        { icon: 'rowing', text: 'Fahrtenbuch', route: '/'},
        { icon: 'bookmark_border', text: 'Reservierungen', route: '/reserve'},
        { icon: 'reorder', text: 'Bootspark', route: '/boats'},
        { icon: 'report_problem', text: 'Schaden melden', route: '/damage'},
        { icon: 'assessment', text: 'Statistiken', route: '/statistics'},
        { icon: 'settings', text: 'Profil', route: '/settings'},
    ], 
  }),
  watch: {
    group () {
      this.drawer = false
    },
  },
  computed: {
    route() {
      return this.$route.path; 
    },
    allowedSite() {
      if(this.$route.path == '/addboat') { return false }
      else if(this.$route.path == '/addtour') { return false }
      return true
    },

  },

  methods: {
    leavedSite() {
      if(this.newroute === '') { this.newroute = this.$route.path }
      if(this.newroute != this.$route.path) {

        // ! SEITE WURDE GEWECHSELT! -> Daten zurücksetzten
          this.searchBar = false
          this.search = ''
          this.$store.dispatch('updateBoatSearchInput', this.search)

        //! -----------------------
        this.newroute = this.$route.path
      }

      

    },
    resetSearch() {
      this.searchBar = !this.searchBar
      this.search = ''
      this.$store.dispatch('updateBoatSearchInput', this.search)
    },
    setSearchInput() {

      this.$store.dispatch('updateBoatSearchInput', this.search)
    },
    back() {
      this.$router.go(-1)
    },
    signout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('/auth')

        
      })
    },
    getData() {
      
      // ? UPDATE USER DATA AFTER PAGE REFRESH

      this.$store.dispatch('getUser').then((data) => {
        this.user = data
      }).catch(() => {
        // ! Konnte keine Daten laden - Und dann??????
      })
      // ? -----------------------------------

      

    },
    
  },
  mounted() {

    this.getData()


  },
  updated: function() {
    this.leavedSite()
  }
}
</script>

<style>


.v-navigation-drawer__border {
  display: none;
}
</style>
