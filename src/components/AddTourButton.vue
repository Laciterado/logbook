
<template>
<div id="addboat">
<v-snackbar v-model="successSnackbar" :timeout="1500" top color="success" >
 <span>{{snackbarText}}</span>
</v-snackbar>
<v-dialog
        persistent
        v-model="dialog"
        scrollable
        max-width="600px"
      >
        <v-snackbar v-model="errorSnackbar" :timeout="1500" absolute top color="error" >
          <span>{{snackbarText}}</span>
        </v-snackbar>
        
        <template v-slot:activator="{ on, attrs }">
        <div class="d-flex align-center" >
        <v-btn block v-bind="attrs" v-on="on" color="success" elevation="0" @click="startForm">
          <v-icon>play_arrow</v-icon><span class="text-uppercase pl-4 d-none d-sm-block" style="padding-top:0.5px">Fahrt beginnen</span>
        </v-btn>
      </div>


   
        </template>


        <v-card>
 
          <v-card-title>
            <span class="text-h5">Neuer Eintrag</span>
            
          </v-card-title>
          <v-card-text>
            <v-container>
              
              <v-row>

                <v-col
                  class="ma-0 mt-0 pa-0"
                  cols="12"
                  sm="6"
                  md="12"
                >
                    <v-select
                    placeholder="Bootsklasse"
                    item-text="text"
                    item-value="id"
                    :items="boatclass"
                    v-model="choosedBoatClass"
                    @change="changedClass"
                    ></v-select>

                </v-col>

                <v-col
                  class="ma-0 mt-0 pa-0"
                  cols="12"
                  sm="12"
                >
                    <v-select
                    :disabled='formDisabled'
                    placeholder="Boot"
                    item-text="name"
                    :items="boats"
                    v-model="choosedBoatName"
                    @change="changedBoat"
                    ></v-select>
                </v-col>
                <v-col
                  v-show="!formDisabled"
                  class="ma-0 mt-6 pa-0"
                  cols="12"
                  sm="12"
                >
                    <span class="font-weight-bold">Daten zum Boot</span>
               </v-col>
                <v-col
                  v-show="!formDisabled"
                  class="ma-0 mt-1 pa-0"
                  cols="12"
                  sm="12"
                >
                    <v-divider></v-divider>
                </v-col>
                <v-col
                  v-show="!formDisabled"
                  class="ma-0 mt-6 pa-0"
                  cols="12"
                  sm="12"
                >
                    <div style="display:flex; justify-content:flex-start; flex-direction:column;">
                        <div style="width:70%; display:flex; justify-content:space-between;" class="pl-4 font-weight-light pb-2"><span>Status:</span><v-icon v-show='!choosedBoat.damaged' left>check</v-icon><v-icon v-show='choosedBoat.damaged' color="error" left>priority_high</v-icon></div>
                        <div style="width:70%; display:flex; justify-content:space-between;" class="pl-4 pb-2 font-weight-light"><span>Reserviert:</span><v-icon v-show='!choosedBoat.reserved' left>check</v-icon><v-icon v-show='choosedBoat.reserved' color="error" left>priority_high</v-icon></div>
                        <div style="width:70%; display:flex; justify-content:space-between;" class="pl-4 pb-2 font-weight-light"><span>Besonderheiten:</span></div>
                        <div style="width:100%; display:flex; justify-content:space-between;" class="pl-4 pb-6 font-weight-thin"><span>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Culpa fugit, laudantium excepturi quis nesciunt ipsa, quibusdam unde quae iusto delectus voluptatibus facilis nulla vero eveniet amet incidunt! Animi, dicta aliquam!</span></div>    
                    </div>
                    <v-divider></v-divider>

                </v-col>
                
                <v-col
                  v-show="!formDisabled"
                  class="ma-0 mt-8 pa-0"
                  cols="12"
                  sm="6"
                  md="12"
                >
                <div><span class="font-weight-bold">Mannschaft</span></div>
                <div><span class="font-weight-light">Für die Statistik auf Schreibweise der Namen achten!</span></div>
                <div><span class="font-weight-light">Einzelne Eingaben mit <b>ENTER</b> bestätigen</span></div>
                    <v-combobox
                        :disabled='formDisabled'
                        v-model="team"
                        :items="items"
                        chips
                        clearable
                        label="Vor- und Nachname"
                        multiple
                    >
                        <template v-slot:selection="{ attrs, item, select, selected }">
                            <v-chip
                                v-bind="attrs"
                                :input-value="selected"
                                close
                                @click:close="removeTeam(item)"
                            >
                                {{ item }}&nbsp;
                            </v-chip>
                        </template>
                    </v-combobox>
                </v-col>
                <v-col
                  v-show="!formDisabled"
                  class="ma-0 mt-8 pa-0"
                  cols="12"
                  sm="6"
                  md="12"
                >
                    <div><span class="font-weight-bold">Ziel(e)</span></div>
                    <div><span class="font-weight-light">Bei mehreren Wendepunkten: Bitte Wendepunkte in Reihenfolge hinzufügen</span></div>
                    <div><span class="font-weight-light">Einzelne Eingaben mit <b>ENTER</b> bestätigen</span></div>
                    <v-combobox
                        :disabled='formDisabled'
                        v-model="destination"
                        :items="items"
                        chips
                        clearable
                        label="Wendepunkt"
                        multiple
                    >
                        <template v-slot:selection="{ attrs, item, select, selected }">
                            <v-chip
                                v-bind="attrs"
                                :input-value="selected"
                                close
                                @click:close="removeDest(item)"
                            >
                                {{ item }}&nbsp;
                            </v-chip>
                        </template>
                    </v-combobox>
                </v-col>

              </v-row>
              
            </v-container>

          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="white"
              text
              @click="closeForm"
            >
              Abbrechen
            </v-btn>
            <v-btn
              color="white"
              text
              @click="addTour"
            >
              Fahrt starten
            </v-btn>
          </v-card-actions>
 
        </v-card>

      </v-dialog>
</div>
</template>

<script>
export default {

  data: () => ({
    destination: '',
    team: '',
    items: [],
    choosedBoatClass: '',
    choosedBoatName: '',
    choosedBoat: [],
    boatclass:[
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
    ],
    boats: [],
    formDisabled: true,
    dialog: false,
    errorSnackbar: false,
    successSnackbar: false,
    snackbarText: '',
    tour: [],
    user: [],

    
  }),
  computed: {
      filterBoatsClass() {
          return this.$store.state.boats.filter((item) => { return item.class.includes(this.choosedBoatClass)})
      },
      filterBoatsName() {
          return this.$store.state.boats.filter((item) => { return item.name.includes(this.choosedBoatName)})
      }
  },
  methods: {
    startForm() {

        this.$store.dispatch('getUser').then((data) => {
        this.user = data
        this.team = [this.user.firstname+' '+this.user.lastname]
        }).catch(() => {
        // ! Konnte keine Daten laden - Und dann??????
        })

    },
    closeForm() {
        this.dialog = false
        this.formDisabled = true
        this.choosedBoat = ''
        this.choosedBoatName = ''
        this.choosedBoatClass = ''
        this.destination = ''
        this.team = ''

      
    },
    removeTeam (item) {
        this.team.splice(this.team.indexOf(item), 1)
        this.team = [...this.team]
    },
    removeDest (item) {
        this.destination.splice(this.destination.indexOf(item), 1)
        this.destination = [...this.destination]
    },    
    changedClass() {

        this.choosedBoat = ''
        this.formDisabled = true
        if(this.choosedBoatClass != '') {
            
            
            if(this.filterBoatsClass != '') {
                this.formDisabled = false;
                this.boats = this.filterBoatsClass
            }
            else {
                this.snackbarText = 'Kein Boot in dieser Klasse vorhanden'
                this.errorSnackbar = true
            }
        }
        else{
            //! Klasse ist weiterhin leer! Formular reset und Warnmeldung
        }
    },
    changedBoat() {
        this.choosedBoat = this.filterBoatsName[0]

    },
    addTour() {
        if(this.choosedBoatClass === '') { this.errorSnackbar = true; this.snackbarText = 'Bootsklasse auswählen' }
        else if(this.choosedBoatName === '') { this.errorSnackbar = true; this.snackbarText = 'Boot auswählen' }
        else if(this.team === '' || this.team === null || this.team.length < 1) { this.errorSnackbar = true; this.snackbarText = 'Keine Mannschaft eingetragen' }
        else if(this.destination === '' || this.destination === null || this.destination.length < 1) { this.errorSnackbar = true; this.snackbarText = 'Kein Ziel angegeben' }
        else {
            this.tour = {id: Date.now(), class: this.choosedBoatClass, boatname:  this.choosedBoatName, starttime: Date.now(), dest:  this.destination, team: this.team}
            this.$store.dispatch('updateOnWater',this.tour)
            this.closeForm()
            this.successSnackbar = true
            this.snackbarText = 'Neue Tour erfolgreich gestartet!'


        }
    }
  },

}
</script>

<style>

</style>

