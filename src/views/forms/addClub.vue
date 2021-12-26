<template>
<div id="site" style="position:absolute; width:100%; height:100%;">
    <div class="content">
        <div style="height:100%; display:flex; justify-content:center; align-items:center;" :class="{'align-start': $vuetify.breakpoint.smAndDown}">
        <v-card style="max-width:700px; width:100%" elevation="0" class="pa-0 ma-0 pa-4" :class="{'transparent': $vuetify.breakpoint.smAndDown}">
            <v-card-title>Verein erstellen</v-card-title>
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
        admins: [],
        members: [],
        requests: [],
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
        
        var user = {}
        user.id = this.$store.state.user.uid
        user.name = this.$store.state.user.firstname+' '+this.$store.state.user.lastname

        this.club.admins.push(user)
        this.club.members.push(user)
        if(this.club.name.length <= 8 || this.club.short.length <= 2 ) {
            this.$store.dispatch('updateSnackbar', {text: 'Eingaben zu kurz!', state: 'true', color: 'error'})  
        }
        else {
            if(this.club.name.length >= 8 && this.club.short.length <= 60) {
            
                if(this.club.short.length >= 2 && this.club.short.length <= 4)
                {
                    this.$store.dispatch('registerClub', {
                    'name': this.club.name,
                    'short': this.club.short,
                    'admins': this.club.admins,
                    'members': this.club.members,
                    'requests': this.club.requests,
                    }).then(() => {

                        this.club.name = ''
                        this.club.short = ''
                        this.club.admins = []
                        this.club.members = []
                        this.club.requests = []

                        this.$store.dispatch('updateSnackbar', {text: 'Neuer Verein gegründet', state: 'true', color: 'success'})
                        this.$router.push('/settings')


                    }).catch((error) => {
                        this.error = error

                    })
                }
                else {
                    this.$store.dispatch('updateSnackbar', {text: 'Vereinskürzel nicht korrekt!', state: 'true', color: 'error'})
                }
            } else {
                this.$store.dispatch('updateSnackbar', {text: 'Vereinsname nicht korrekt!', state: 'true', color: 'error'})
            }

        }

      },
},

}
</script>

<style>

</style>