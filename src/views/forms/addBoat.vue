<template>
  <div id="site" style="width:100% height:100%; display:flex; flex-direction:column;">

    <!-- <div class="pl-4 pt-8 pb-8 d-flex"><h3 class="d-none d-sm-block text-uppercase font-weight-light">Boot hinzufügen</h3></div> -->
    
    <div style="display:flex; overflow-y: scroll; height:80vh; width:100vw; justify-content:center; align-items:center;" :class="{'align-start': $vuetify.breakpoint.smAndDown}">
    <v-card class="pa-4" style="width:600px; height:auto;" elevation="0" :class="{'transparent': $vuetify.breakpoint.smAndDown}" >
        <v-card-title class="pa-0 ma-0 mb-4 overline success--text">
          <v-icon class="mr-4 success--text">rowing</v-icon>
          Bootsdaten eingeben
            
        </v-card-title>
        <v-card-text class="pa-0 mb-4">

        <v-container>
            
            <v-row>
              
            <v-col
                class="ma-0 mt-4 pa-0"
                cols="12"
                sm="12"
      
            >
                <v-text-field
                label="Bootname"
                hint="Maximal 20 Zeichen lang"
                persistent-hint
                v-model="boatname"
                
                ></v-text-field>
            </v-col>

            <v-col
                class="ma-0 mt-8 pa-0"
                cols="12"
  
                sm="12"
            >
                <v-select
                placeholder="Bootsklasse"
                item-text="text"
                item-value="id"
                :items="boats"
                v-model="boatclass"
                ></v-select>
            </v-col>
            
            </v-row>
            
        </v-container>

        </v-card-text>
        <v-card-actions class="pa-0">
        <v-spacer></v-spacer>
        <!-- <v-btn
            class="d-none d-sm-block"
            color="error"
            elevation="0"
            @click="back()"
        >
            Zurück
        </v-btn> -->
        <v-btn
            class="darkbg--text"
            color="success"
            elevation="0"
            @click="checkForm"
        >
            Hinzufügen
        </v-btn>
  
        </v-card-actions>

    </v-card>
    </div>

  </div>
</template>

<script>
export default {

  data: () => ({

    boatname: '',
    boatclass: '',
    boats: [ 
      { text: "1X Einer", id: '1X' },
      { text: "2X Doppelzweier", id: '2X' },
      { text: "2X+ Gest. Doppelzweier", id: '2X+' },
      { text: "2- Zweier-Ohne", id: '2-' },
      { text: "2+ Gest. Zweier", id: '2+' },
      { text: "3X+ Gest. Doppeldreier", id: '3X+' },
      { text: "3X Doppeldreier", id: '3X' },
      { text: "4X Doppelvierer", id: '4X' },
      { text: "4X+ Gest. Doppelvierer", id: '4X+' },
      { text: "4- Vierer-Ohne", id: '4-' },
      { text: "4+ Gest. Vierer", id: '4+' },
      { text: "5X+ Gest. Doppelfünfer", id: '5X+' },
      { text: "6X+ Gest. Doppelsechser", id: '6X+' },
      { text: "8X+ Gest. Doppelachter", id: '8X+' },
      { text: "8+ Achter", id: '8+' },
    ]
  }),
  
  methods: {
    back() {
      this.boatname = ''
      this.boatclass = ''
      //this.$router.replace('/boats')
      this.$router.go(-1)
    },
    checkForm () {
      if(this.boatclass === '' && this.boatname === '') {
        
        this.$store.dispatch('updateSnackbar', {text: 'Keine Daten eingegeben!', state: 'true', color: 'error'})
      }
      else if(this.boatclass === '' && this.boatname != '')
      {
        this.$store.dispatch('updateSnackbar', {text: 'Keine Bootsklasse ausgewählt!', state: 'true', color: 'error'})
      }
      else if(this.boatclass != '' && this.boatname === '')
      {
        this.$store.dispatch('updateSnackbar', {text: 'Kein Bootsname eingegeben!', state: 'true', color: 'error'})
      }
      else if(this.boatname.length > 20)
      {
        this.$store.dispatch('updateSnackbar', {text: 'Name zu lang (Maximal 20 Zeichen)', state: 'true', color: 'error'})
      }
      else {

        this.$store.dispatch('addBoat',{ class: this.boatclass, name: this.boatname}).then(() => {
          this.boatname = ''
          this.boatclass = ''
          this.$store.dispatch('updateSnackbar', {text: 'Boot erfolgreich hinzugefügt', state: 'true', color: 'success'})
          this.$router.push('/boats')
        }).catch({

        }) 
        

      }

    },
   
    
    
    
  },

}
</script>

<style>

</style>