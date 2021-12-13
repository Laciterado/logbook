<template>
<div>


<v-footer 
  v-if="allowedSite" 
  dense elevation="20" 
  style="z-index:1;"

  fixed
  left
  app
>

  <div class="py-1 d-flex justify-center align-center hover" v-if="route === '/boats'">
    <div class="d-flex align-center" >
        <v-btn block color="success" elevation="0" @click='sitechange()'>
          <v-icon>add</v-icon><span class="text-uppercase pl-4 d-none d-sm-block" style="padding-top:0.5px">BOOT Hinzufügen</span>
        </v-btn>
      </div>
  </div>

  <div class="py-1 d-flex justify-center align-center hover" v-if="route === '/'">
      <div class="d-flex align-center" >
        <v-btn block color="success" elevation="0" :to="'/addtour'">
          <v-icon>play_arrow</v-icon><span class="text-uppercase pl-4 d-none d-sm-block" style="padding-top:0.5px">Fahrt beginnen</span>
        </v-btn>
      </div>
  </div>



<!----
  <div class="py-1 d-flex align-center hover" v-if="route === '/'">
    <v-icon>play_arrow</v-icon>
    <div class="d-none d-sm-block">
    <span class="font-weight-light text-uppercase pl-4">FAHRT BEGINNEN</span>
    </div>
  </div>
//! Seite neu laden - aktuell nicht notwendig!
<v-spacer></v-spacer>

  <div class="py-1 d-flex align-center hover" @click="refresh()">
    <div class="d-none d-sm-block">
    <span class="font-weight-light text-uppercase pr-4">Seite Neuladen</span>
    </div>
    <v-icon>refresh</v-icon>
  </div>


---->

</v-footer>
  

</div>

</template>

<script>


export default {

  data: () => ({
    addBoat: false,
  }),
  computed: {
    route() {
      return this.$route.path; 
    },
    allowedSite() {
      if(this.$route.path == '/reserve') { return false }
      else if(this.$route.path == '/damage') { return false }
      else if(this.$route.path == '/statistics') { return false }
      else if(this.$route.path == '/settings') { return false }
      else if(this.$route.path == '/addboat') { return false }
      else if(this.$route.path == '/addtour') { return false }
      return true
    },
  },
  methods: {
    sitechange() {
      this.$router.replace('/addboat')
    }
  },
}
</script>

<style>
.hover:hover {
  cursor: pointer;
}
</style>
