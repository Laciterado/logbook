<template>
  <div id="site" style="position:absolute; width:100%; height:100%;">
    

  <div class="content px-4 px-sm-0 d-flex justify-center align-center" v-if="boats.length < 1 && user.activeClubID != null">
    <v-card max-width="750" class="pa-sm-4 pa-0" elevation="0" :class="{'transparent': $vuetify.breakpoint.smAndDown}">
      <v-card-title class="pa-0 ma-0 overline success--text mb-4">
          <v-icon class="mr-4 success--text d-sm-block d-none">report_problem</v-icon>
          Keine Boot vorhanden
      </v-card-title>
      <v-card-text class="pa-0 py-4 d-flex flex-column">
          <span class="caption text-uppercase primary--text font-weight-light mb-4">Dieser Verein besitzt aktuell keine Boote</span>
          <span class="caption text-uppercase">Um diese Funktion nutzen zu können, musst du zuerst ein neues Boot erstellen.</span>
      </v-card-text>
      <v-card-actions class="pa-0 ma-0 mt-4">
          <v-spacer class="d-sm-block d-none"></v-spacer>
          <v-btn small color="success" class="darkbg--text" :to="'/addboat'">Boot hinzufügen</v-btn>
          
      </v-card-actions>
    </v-card>
  </div>  

    <div class="content px-4 px-sm-0 d-flex justify-center align-center" v-if="user.activeClubID == null">
      <v-card max-width="750" class="pa-sm-4 pa-0" elevation="0" :class="{'transparent': $vuetify.breakpoint.smAndDown}">
      <v-card-title class="pa-0 ma-0 overline success--text mb-4">
          <v-icon class="mr-4 success--text">home</v-icon>
          Willkommen
      </v-card-title>
      <v-card-text class="pa-0 py-4 d-flex flex-column">
        <span class="caption text-uppercase primary--text font-weight-light mb-4">Du bist aktuell keinem Verein zugehörig</span>
        <span class="caption text-uppercase">Trete zuerst einem Verein bei<br>oder<br> erstelle deinen eigenen, um alle Funktionen nutzen zu können.</span>
      </v-card-text>
    </v-card>
    </div>
    
    <div class="content px-4 px-sm-0" v-if="user.clubs != null">
      <!---
      <h3 class="pl-4 pt-8 pb-4 d-none d-sm-block text-uppercase font-weight-light">Fahrtenbuch</h3>
      --->


    
      <!---
      //? -----------------------------------------------------------------------------------------
      //? Boote auf dem Wasser
      //? -----------------------------------------------------------------------------------------
      --->
     
      <div class="cards justify-center justify-sm-start pt-4 pr-4">
        
        <v-card
          v-for="tour of onwater" :key="tour.id"
          class="ml-0 ml-sm-4 mb-4"
          :class="{'flex-grow-1': onwater.length > 2}"
          style="min-width:340px;"
        
        >
          <v-card-text>

            <div class="d-flex justify-space-between align-center mb-4" style="width:100%;">
              
              <span class="white--text text-uppercase"><span class="success--text">{{tour.class}}</span> {{ tour.boatname }}</span>
              
             
                <v-icon class="hover" color="success" style="margin-right:-8px">mdi-dots-vertical</v-icon>
         

              
            </div>

            <v-divider class="ma-0 pb-4"></v-divider>
            <p><v-icon small left>schedule</v-icon>{{ getDate(tour.starttime) }}</p>
            <p><v-icon small left>location_on</v-icon>{{ tour.dest[0] }}</p>
          </v-card-text>
          


        </v-card>
   
      </div>

    </div>

  </div>  



</template>

<script>

import { mapGetters } from "vuex";



export default {

  components: {
     
    },
    
    data() {
      return {

        onwater: [],
        reserved: [],
        
      }
    },
    computed: {
    ...mapGetters({user: 'getUser'}),
    ...mapGetters({boats: 'getBoats'}),
    },
    methods: {
      changeSelect(selectedItem) {
        if(selectedItem === 1) {
          this.selected = 1;
        }
        else if(selectedItem === 2) {
          this.selected = 2;
        }
      },
      getTours() {
        this.onwater = this.$store.state.onwater;
        
        
      },
      getDate(timest) {
        var date = new Date(timest);
        let min
        if(date.getMinutes() < 10) { min = ('0'+date.getMinutes()) } else { min = date.getMinutes() }
        return date.getDate()+
          "."+(date.getMonth()+1)+
          "."+date.getFullYear()+
          " - "+date.getHours()+
          ":"+(min)+
          "Uhr"

      },

    },
    created: function() {
      this.getTours()

    }


}  
</script>

<style>

.cards {
  width:100%;
  display:flex;
  flex-wrap: wrap;
  flex-direction: row;
  align-content: flex-start;


}

</style>
