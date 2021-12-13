<template>

    <div id="site" class="site" style="width:100%; height:100%;">

        <v-snackbar absolute v-model="snackbar.state" :timeout="1500" top :color='snackbar.color'>
             <span>{{snackbar.text}}</span>
        </v-snackbar>   

        <div class="pl-4 pt-8 pb-8 d-flex">
            <!---
            <h3 class="d-none d-sm-block text-uppercase font-weight-light">Neuer Eintrag</h3>
            --->
            <span class="ma-0 pa-0 d-sm-none text-uppercase font-weight-light" v-show="site === 0">Bootdaten eingeben</span>
            <span class="ma-0 pa-0 d-sm-none text-uppercase font-weight-light" v-show="site > 0">Weitere Eingaben</span>
        </div>
        <div style="width:100%; height:75%; display:flex; justify-content:center; align-items:center;">

            <v-card class=" pa-4" style="width:700px;" elevation="0" :class="{'transparent': $vuetify.breakpoint.smAndDown}" >
    
            <v-card-title class="my-2 pl-1 mb-4 d-none d-sm-block">
                <span class="ma-0 pa-0 text-uppercase font-weight-light" v-show="site === 0">Bootdaten eingeben</span>
                <span class="ma-0 pa-0 text-uppercase font-weight-light" v-show="site > 0">Weitere Eingaben</span>
                
            </v-card-title>
            <v-card-text style="height:350px; overflow-y:auto" class="scroll--simple">

                <v-row>

                    <v-col
                    class="ma-0 mt-0 pa-0"
                    cols="12"
                    sm="12"
                    md="12"
                    v-show="site === 0"
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
                    class="ma-0 mt-4 pa-0"
                    cols="12"
                    sm="12"
                    v-show="site === 0"
                    >
                        <v-select
                        :disabled='noClass'
                        placeholder="Boot"
                        item-text="name"
                        :items="boats"
                        v-model="choosedBoatName"
                        @change="changedBoat"
                        
                        ></v-select>
                    </v-col>
                    <v-col
                    v-show="site === 0 && !formDisabled"
                    class="ma-0 mt-6 pa-0"
                    cols="12"
                    sm="12"
                    >
                        <span class="font-weight-bold">Daten zum Boot</span>
                </v-col>
                    <v-col
                    v-show="site === 0 && !formDisabled"
                    class="ma-0 mt-1 pa-0"
                    cols="12"
                    sm="12"
                    >
                        <v-divider></v-divider>
                    </v-col>
                    <v-col
                    v-show="site === 0 && !formDisabled"
                    class="ma-0 mt-6 pa-0"
                    cols="12"
                    sm="12"
                    >
                        <div style="display:flex; justify-content:flex-start; flex-direction:column;">
                            <div style="width:70%; display:flex; justify-content:space-between;" class="pl-4 font-weight-light pb-2"><span>Status:</span><v-icon v-show='!choosedBoat.damaged' left>check</v-icon><v-icon v-show='choosedBoat.damaged' color="error" left>priority_high</v-icon></div>
                            <div style="width:70%; display:flex; justify-content:space-between;" class="pl-4 pb-2 font-weight-light"><span>Reserviert:</span><v-icon v-show='!choosedBoat.reserved' left>check</v-icon><v-icon v-show='choosedBoat.reserved' color="error" left>priority_high</v-icon></div>
                            <div style="width:70%; display:flex; justify-content:space-between;" class="d-none d-sm-block pl-4 pb-2 font-weight-light"><span>Besonderheiten:</span></div>
                        </div>
                        <v-divider></v-divider>

                    </v-col>
                    
                    <v-col
                    v-show="site === 1"
                    class="ma-0 mt-8 pa-0"
                    cols="12"
                    sm="12"
                    md="12"
                    >
                    <div class="mb-4"><span class="font-weight-light text-h6">Mannschaft</span></div>
                    <div><span class="font-weight-light">Auf Schreibweise der Namen achten!</span></div>
                    <div><span class="font-weight-light">Einzelne Eingaben mit <b>ENTER</b> bestätigen</span></div>
                        <v-combobox
                            class="mt-4"
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
                    v-show="site === 2"
                    class="ma-0 mt-8 pa-0"
                    cols="12"
                    sm="12"
                    md="12"
                    >
                        <div class="mb-4"><span class="font-weight-light text-h6">Ziel(e)</span></div>
                        <div><span class="font-weight-light">Bei mehreren Wendepunkten: Bitte Wendepunkte in Reihenfolge hinzufügen</span></div>
                        <div><span class="font-weight-light">Einzelne Eingaben mit <b>ENTER</b> bestätigen</span></div>
                        <v-combobox
                            class="mt-4"
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
 

            </v-card-text>
            <v-card-actions class="ma-0 pa-0 mr-2 mb-8 mt-10">
                <v-spacer></v-spacer>
                <v-btn
                color="error"
                elevation="0"
                @click="changeSite('minus')"
                >
                    Zurück
                </v-btn>
                <v-btn
                    class="ml-4"
                    color="success"
                    elevation="0"
                    @click="changeSite('plus')"
                    v-show="site < 2"
                    :disabled="formDisabled"
                >
                    Weiter
                </v-btn>
                <v-btn
                    class="ml-4"
                    color="success"
                    elevation="0"
                    @click="addTour"
                    v-show="site === 2"
                >
                    Fahrt starten
                </v-btn>
            </v-card-actions>
    
            </v-card>

        </div>
   
    </div>

</template>

<script>
export default {

  data: () => ({

    dialog: true,
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
    noClass: false,
    site: 0,

    snackbar: [],
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
      back() {
      this.$router.replace('/')
    },
    
    removeTeam (item) {
        this.team.splice(this.team.indexOf(item), 1)
        this.team = [...this.team]
    },
    removeDest (item) {
        this.destination.splice(this.destination.indexOf(item), 1)
        this.destination = [...this.destination]
    },
    changeSite(val) {
        if(val ==="plus") { this.site++ } else { this.site-- }
        if(this.site < 0 ) { this.back() }

        
    },   
    changedClass() {

        this.choosedBoat = ''
        this.choosedBoatName = ''
        this.noClass = true

        if(this.choosedBoatClass != '') {
            
            
            if(this.filterBoatsClass != '') {
                this.formDisabled = true;
                this.noClass = false;
                this.boats = this.filterBoatsClass
            }
            else {
                //! this.snackbarText = 'Kein Boot in dieser Klasse vorhanden'
                
            }
        }
        else{
            //! Klasse ist weiterhin leer! Formular reset und Warnmeldung
        }
    },
    changedBoat() {
        this.choosedBoat = this.filterBoatsName[0]
        this.formDisabled = false;

    },
    addTour() {
        if(this.choosedBoatClass === '') { this.snackbar = {text: 'Bootsklasse auswählen!', state: 'true', color: 'error'}}
        else if(this.choosedBoatName === '') { this.snackbar = {text: 'Boot auswählen!', state: 'true', color: 'error'} }
        else if(this.team === '' || this.team === null || this.team.length < 1) { this.snackbar = {text: 'Keine Mannschaft eingetragen', state: 'true', color: 'error'}}
        else if(this.destination === '' || this.destination === null || this.destination.length < 1) { this.snackbar = {text: 'Kein Ziel eingegeben!', state: 'true', color: 'error'}}
        else {
            this.tour = {id: Date.now(), class: this.choosedBoatClass, boatname:  this.choosedBoatName, starttime: Date.now(), dest:  this.destination, team: this.team}
            this.$store.dispatch('updateOnWater',this.tour)
            this.$store.dispatch('updateSnackbar', {text: 'Tour erfolgreich gestartet', state: 'true', color: 'success'})
            this.$router.replace('/')


        }
    }
  },
  created: function() {
        this.$store.dispatch('getUser').then((data) => {
        this.user = data
        this.team = [this.user.firstname+' '+this.user.lastname]
        }).catch(() => {
        // ! Konnte keine Daten laden - Und dann??????
        })
  },

}
</script>

<style>


</style>