<template>
<div id="site" style="position:absolute; width:100%; height:100%;">
    <div class="content">
        <div style="height:100%; display:flex; justify-content:center; align-items:center;" :class="{'align-start': $vuetify.breakpoint.smAndDown}">
            <v-card style="max-width:700px; width:100%" elevation="0" class="pa-0 ma-0 pa-4" :class="{'transparent': $vuetify.breakpoint.smAndDown}">
                <v-card-title class="pa-0 ma-0 mb-4">Reservierung erstellen</v-card-title>
                <v-card-text class="pa-0 ma-0">
                    <v-select
                        label="Boot auswählen"
                        class="mb-4"
                        v-model="choosedBoat"
                        :items="boats"
                        item-text="name"
                        item-value="id"
                    ></v-select>

                    <div class="d-flex" style="width:100%">
                        <div style="width:100%">
                            <span class="caption">Startdatum</span>
                            <input type="date" name="date" class="mb-8" v-model="date">
                        </div>
                        <div style="width:100%">
                            <span class="caption">Startzeit</span>
                            <input type="time" name="time" class="mb-8" v-model="time">
                        </div>
                    </div>
                    
                    <div class="d-flex" style="width:100%">
                        <div style="width:100%">
                            <span class="caption">Enddatum</span>
                            <input type="date" name="date2" class="mb-8" v-model="date2">
                        </div>
                        <div style="width:100%">
                            <span class="caption">Endzeit</span>
                            <input type="time" name="time2" class="mb-8" v-model="time2">
                        </div>
                    </div>

                    <span class="caption">Reservierungsinformation</span>
                    <v-textarea
                        :auto-grow="true"
                        v-model="desc"
                        dense
                        flat
                        :rounded="false"
                        rows="4"
                        class="mb-6"
                    ></v-textarea>


                </v-card-text>
                <v-card-actions class="pa-0 ma-0">
                    <v-spacer></v-spacer>
                    <v-btn
                        color="success"
                        elevation="0"
                        @click="addReservation()"
                        class="ml-4"
                    >
                        Absenden
                    </v-btn>

                </v-card-actions>
            </v-card>
        </div>
    </div>    
</div> 

</template>

<script>
import { mapGetters } from "vuex";

export default {
    data: () => ({
        date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        date2: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
        time: new Date().toLocaleTimeString([], {timeStyle: 'short'}),
        time2: new Date().toLocaleTimeString([], {timeStyle: 'short'}),
        desc: '',
        choosedBoat: null,
    }),
    mounted() {
        if(this.$route.params.bid != null) { this.checkBoatId(this.$route.params.bid) }
    },
    updated () {


    },
    computed: {
        ...mapGetters({boats: 'getBoats'}),
    },
    methods: {
        addReservation() {
            const toTimestamp = (strDate) => {  
                const dt = Date.parse(strDate);  
                return dt;  
            }
            const startdate = toTimestamp(this.date+' '+this.time+':00')
            const enddate = toTimestamp(this.date2+' '+this.time2+':00')
            if(this.choosedBoat != null)
            {
                if(startdate != enddate && enddate > startdate) { 
                    if(this.desc != '') {

                        const boat = this.boats.find( boat => boat.id === this.choosedBoat)

                        const event = {
                            name: boat.name,
                            boatid: boat.id,
                            start: startdate,
                            end: enddate,
                            color: 'blue',
                            timed: true,
                            desc: this.desc,
                        }

                        this.$store.dispatch('addReservation', event).then(() => {
                            this.$store.dispatch('updateSnackbar', {text: 'Reservierung hinzugefügt', state: 'true', color: 'success'})
                            this.desc = ''
                            this.choosedBoat = null
                            this.date = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
                            this.date2 = (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)
                            this.time = new Date().toLocaleTimeString([], {timeStyle: 'short'})
                            this.time2 = new Date().toLocaleTimeString([], {timeStyle: 'short'})
                            this.$router.go(-1)

                        }).catch((error) => {
                            console.log(error)
                            this.$store.dispatch('updateSnackbar', {text: 'Ein unbekannter Fehler ist aufgetreten!', state: 'true', color: 'error'})
                        })

                    }
                    else {
                        this.$store.dispatch('updateSnackbar', {text: 'Reservierungsinformation fehlt', state: 'true', color: 'error'})
                    }
                }
                else {
                    this.$store.dispatch('updateSnackbar', {text: 'Start und Ende fehlerhaft!', state: 'true', color: 'error'})
                }
            } else {
                this.$store.dispatch('updateSnackbar', {text: 'Kein Boot ausgewählt!', state: 'true', color: 'error'})
            }
            
        },
        checkBoatId(id) {
            const search = this.boats.find( boat => boat.id === id)
            if(search != null) {
                this.choosedBoat = search.id
            }
            else {
                this.$store.dispatch('updateSnackbar', {text: 'Eingegebenes Boot nicht gefunden!', state: 'true', color: 'error'})
            }
        },
    }
    
}
</script>

<style>
input[type=date], input[type=time] {
    font-size: 16px;
    width:100%;
    padding-bottom:4px;
    color:white;
    border-bottom:1px solid white;
}
input::-webkit-calendar-picker-indicator {
    display:none;

}
input[type=date]:focus {
  border: 0px solid white;
  border-bottom:1px solid white;
  outline: none;
}
input[type=time]:focus {
  border: 0px solid white;
  border-bottom:1px solid white;
  outline: none;
}
</style>