<template>
<div id="site" style="position:absolute; width:100%; height:100%;">
    <div class="content">
        <div style="height:100%; display:flex; justify-content:center; align-items:center;" :class="{'align-start': $vuetify.breakpoint.smAndDown}">
        <v-card style="max-width:700px; width:100%" elevation="0" class="pa-0 ma-0 pa-4" :class="{'transparent': $vuetify.breakpoint.smAndDown}">
            <v-card-title class="pa-4 ma-0 overline success--text">
                    <v-icon class="mr-4 success--text">add_business</v-icon>
                
                Verein erstellen</v-card-title>
            <v-card-text>
                <v-text-field
                label="Vereinsname"
                hint="8 bis 60 Zeichen lang"
                persistent-hint
                v-model="club.name"
                :rules="rules2"
                ></v-text-field>
                <v-text-field
                v-model="club.short"
                class="mb-6"
                label="Vereinskürzel"
                hint="2 bis 4 Zeichen lang"
                :rules="rules"
                persistent-hint
                ></v-text-field>
                <span class="caption mb-8">Nachdem der Verein erstellt wurde, wirst du automatisch der Admin dieses Vereins. Du kannst später weitere Mitglieder einladen und weitere Admins einstellen.</span>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="success"
                    elevation="0"
                    class="ml-4"
                    @click="registerClub()"
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


export default {

data: () => ({ 
    club: {
        name: '',
        short: '',
      },
    rules: [
      value => (value || '').length <= 4 || 'Max. 4 Zeichen lang',
      value => (value || '').length >= 2 || 'Min. 2 Zeichen lang',
    ],
    rules2: [
      value => (value || '').length <= 60 || 'Max. 60 Zeichen lang',
      value => (value || '').length >= 8 || 'Min. 8 Zeichen lang',
    ],

}),

methods: {
    registerClub() {
        
        if(this.club.name.length <= 8 || this.club.short.length <= 2 ) {
            this.$store.dispatch('updateSnackbar', {text: 'Eingaben zu kurz!', state: 'true', color: 'error'})  
        }
        else {
            if(this.club.name.length >= 8 && this.club.short.length <= 60) {
            
                if(this.club.short.length >= 2 && this.club.short.length <= 4)
                {
                    this.$store.commit('setOverlay', true)
                    this.$store.dispatch('registerClub', {
                    'name': this.club.name,
                    'short': this.club.short,
                    }).then(() => {

                        this.club.name = ''
                        this.club.short = ''

                        this.$store.dispatch('updateSnackbar', {text: 'Neuer Verein gegründet', state: 'true', color: 'success'})
                        this.$store.commit('setOverlay', false)
                        this.$router.go(-1)

                    }).catch((error) => {
                        this.error = error

                    })
                }
                else {
                    this.$store.dispatch('updateSnackbar', {text: 'Vereinskürzel nicht korrekt!', state: 'true', color: 'error'})
                    this.$store.commit('setOverlay', false)
                }
            } else {
                this.$store.dispatch('updateSnackbar', {text: 'Vereinsname nicht korrekt!', state: 'true', color: 'error'})
                this.$store.commit('setOverlay', false)
            }

        }

      },
},

}
</script>

<style>

</style>