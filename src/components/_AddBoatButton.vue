
<template>
<div id="addboat">
<v-snackbar v-model="successSnackbar" :timeout="1500" top color="success" >
 <span>{{snackbarText}}</span>
</v-snackbar>
<v-dialog
        persistent
        v-model="dialog"
        max-width="600px"
      >
        <v-snackbar v-model="errorSnackbar" :timeout="1500" absolute top color="error" >
          <span>{{snackbarText}}</span>
        </v-snackbar>
        
        <template v-slot:activator="{ on, attrs }">
        <div class="d-flex align-center" >
        <v-btn block v-bind="attrs" v-on="on" color="success" elevation="0">
          <v-icon>add</v-icon><span class="text-uppercase pl-4 d-none d-sm-block" style="padding-top:0.5px">BOOT Hinzufügen</span>
        </v-btn>
      </div>


   
        </template>


        <v-card>
 
          <v-card-title>
            <span class="text-h5">Boot hinzufügen</span>
            
          </v-card-title>
          <v-card-text>
            <v-container>
              
              <v-row>
       
                <v-col
                  class="ma-0 mt-4 pa-0"
                  cols="12"
                  sm="6"
                  md="12"
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
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="white"
              text
              @click="dialog = false"
            >
              Abbrechen
            </v-btn>
            <v-btn
              color="white"
              text
              @click="checkForm"
            >
              Hinzufügen
            </v-btn>
          </v-card-actions>
 
        </v-card>

      </v-dialog>
</div>
</template>

<script>
export default {

  data: () => ({
    dialog: false,
    errorSnackbar: false,
    successSnackbar: false,
    snackbarText: '',


    boatname: '',
    boatclass: '',
    boats: [ 
      { text: "1X Einer", id: '1x' },
      { text: "2X Doppelzweier", id: '2x' },
      { text: "2X+ Gest. Doppelzweier", id: '2x+' },
      { text: "2- Zweier-Ohne", id: '2-' },
      { text: "2+ Gest. Zweier", id: '2+' },
      { text: "4X Doppelvierer", id: '4x' },
      { text: "4X+ Gest. Doppelvierer", id: '4x+' },
      { text: "4- Vierer-Ohne", id: '4-' },
      { text: "4+ Gest. Vierer", id: '4+' },
      { text: "6X+ Gest. Doppelsechser", id: '6x+' },
      { text: "8X+ Gest. Doppelachter", id: '8x+' },
      { text: "8+ Achter", id: '8+' },
    ]
  }),
  methods: {
    checkForm () {
      if(this.boatclass === '' && this.boatname === '') {
        this.errorSnackbar = true
        this.snackbarText = 'Keine Daten eingegeben!'
      }
      else if(this.boatclass === '' && this.boatname != '')
      {
        this.errorSnackbar = true
        this.snackbarText = 'Bootsklasse auswählen!'
      }
      else if(this.boatclass != '' && this.boatname === '')
      {
        this.errorSnackbar = true
        this.snackbarText = 'Bootsnamen eingeben!'
      }
      else if(this.boatname.length > 20)
      {
        this.errorSnackbar = true
        this.snackbarText = 'Der Name darf maximal 20 Zeichen lang sein!'
      }
      else {
        this.dialog = false
        this.$store.dispatch('addBoat',{ class: this.boatclass, name: this.boatname, damaged: false, reserved: false}); //! ID muss noch festgelegt werden
        this.boatname = ''
        this.boatclass = ''
        this.successSnackbar = true
        this.snackbarText = 'Neues Boot erfolgreich hinzugefügt!'

      }
    },
    
    
    
  },

}
</script>

<style>

</style>

