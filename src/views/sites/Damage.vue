<template>
<div id="site" style="position:absolute; width:100%; height:100%;">
    <div class="content px-4 px-sm-0 d-flex justify-center align-center" v-if="boats.length < 1">
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
    <div class="content" v-if="user.clubs != null && boats.length > 0">
            <div style="height:100%; display:flex; justify-content:center; align-items:center;" :class="{'align-start': $vuetify.breakpoint.smAndDown}">
            <v-card style="max-width:700px; width:100%" elevation="0" class="pa-0 ma-0 pa-4" :class="{'transparent': $vuetify.breakpoint.smAndDown}">
                <v-card-title class="pa-0 ma-0 mb-4 overline success--text">
                    <v-icon class="mr-4 success--text">warning_amber</v-icon>
                    
                    
                    Bootsschaden melden</v-card-title>
                <v-card-text class="pa-0 ma-0">
                    <v-select
                        label="Boot auswählen"
                        v-model="choosedBoat"
                        :items="boats"
                        item-text="name"
                        item-value="id"
                        class="mb-4"
                        @change="formChanged()"
                    ></v-select>
                    <span class="overline font-weight-light">Boot sperren:</span> <span v-if="locking" class="error--text caption">(ist gesperrt)</span>
                    <v-switch
                        v-model="locking"
                        color="error"
                    ></v-switch>
                    <div class="d-flex flex-column mb-6" v-if="damaged">
                        <span class="overline warning--text font-weight-bold">Achtung</span>
                        <span class="overline warning--text">Es liegt bereits ein Schaden vor!</span>
                        <span class="overline font-weight-light">Schaden bearbeiten?</span>
                    </div>
                    <v-textarea
                        :auto-grow="true"
                        v-model="damage_desc"
                        dense
                        flat
                        :rounded="false"
                        rows="4"
                        label="Schadenbeschreibung:"
                        class="mb-6 mt-4"
                    ></v-textarea>
                </v-card-text>
                <v-card-actions class="pa-0 ma-0">
                    <v-spacer></v-spacer>
                    <v-btn
                        small
                        v-if="damaged"
                        color="error"
                        elevation="0"
                        @click="deleteDamage()"
                        class="darkbg--text"
                    >
                        Löschen
                    </v-btn>
                    <v-btn
                        small
                        color="success"
                        elevation="0"
                        @click="checkForm()"
                        class="ml-4 darkbg--text"
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

// ! Beispiel ID: 8sIVLWBA8Y2eBHYnf6mF


import { mapGetters } from "vuex";
export default {
    data: () => ({ 
        choosedBoat: null,
        damage_desc: '',
        damaged: false,
        locking: false,
    }),
    computed: {
        ...mapGetters({boats: 'getBoats'}),
        ...mapGetters({user: 'getUser'}),
    },
    methods: {
        deleteDamage() {
            if(this.damaged) {
                this.$store.dispatch('editBoatDamage', { id: this.choosedBoat, damaged: false, damage_desc: null}).then(() => {
                    this.$store.dispatch('updateSnackbar', {text: 'Bootsschaden gelöscht!', state: 'true', color: 'success'})
                    this.choosedBoat = null
                    this.damage_desc = null
                    this.damaged = false

                }).catch((error) => {
                    this.$store.dispatch('updateSnackbar', {text: 'Es ist ein Fehler aufgetreten!', state: 'true', color: 'error'})
                    console.log(error)
                })               
            } else {
                this.$store.dispatch('updateSnackbar', {text: 'Es liegt kein Schaden vor!', state: 'true', color: 'error'})
            }
        },
        checkForm() {
            if(this.choosedBoat == null) {
                this.$store.dispatch('updateSnackbar', {text: 'Kein Boot ausgewählt!', state: 'true', color: 'error'})
            }
            else if(this.damage_desc == null || this.damage_desc == '' || this.damage_desc == ' ') {
                this.$store.dispatch('updateSnackbar', {text: 'Schadenbeschreibung fehlt!', state: 'true', color: 'error'})
            }
            else {
                this.$store.dispatch('editBoatDamage', { id: this.choosedBoat, damaged: true, damage_desc: this.damage_desc, locked: this.locking}).then(() => {
                    this.$store.dispatch('updateSnackbar', {text: 'Bootsschaden gemeldet!', state: 'true', color: 'success'})
                    this.choosedBoat = null
                    this.damage_desc = null
                    this.damaged = false
                    this.locking = false

                }).catch((error) => {
                    this.$store.dispatch('updateSnackbar', {text: 'Es ist ein Fehler aufgetreten!', state: 'true', color: 'error'})
                    console.log(error)
                })
            }
            
        },
        formChanged() {
            const boat = this.boats.find( boat => boat.id === this.choosedBoat)
            this.damaged = boat.damaged
            this.damage_desc = boat.damage_desc
            this.locking = boat.locked
        },
        checkBoatId(id) {
            const search = this.boats.find( boat => boat.id === id)
            if(search != null) {
                this.choosedBoat = search.id
                if(search.damaged) {
                    this.damaged = true
                }
                if(search.damage_desc != null) {
                    this.damage_desc = search.damage_desc
                }
                if(search.locked) {
                    this.locking = true
                }
            }
            else {
                this.$store.dispatch('updateSnackbar', {text: 'Eingegebenes Boot nicht gefunden!', state: 'true', color: 'error'})
            }
        }
    },
    mounted: function() {

        if(this.$route.params.bid != null) { this.checkBoatId(this.$route.params.bid) }
    },
    updated: function() {

    }
}
</script>

<style>

</style>