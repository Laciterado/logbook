<template>

  <div id="site" style="position:absolute; width:100%; height:100%;">

    <div class="content px-4 px-sm-0">

    <v-btn class="my-4 mx-4" @click="registerClub()">
      Register Club
    </v-btn>
    <v-btn class="my-4 mx-4" @click="updateUser()">
      Update User
    </v-btn>
    <v-btn class="my-4 mx-4" @click="addBoat()">
      Add Boat Example
    </v-btn>


    <span>{{error}}</span>

    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      club: {
        name: null,
        short: null,
        admins: [],
        requests: [],
      },
      error: '',
    }
  },
  methods: {

    registerClub() {

        this.club.name = 'Erster Kieler Ruderclub'
        this.club.short = 'EKRC'
        
        var user = {}
        user.id = this.$store.state.user.uid
        user.name = this.$store.state.user.firstname+' '+this.$store.state.user.lastname

        this.club.admins.push(user)

        this.$store.dispatch('registerClub', {
          'name': this.club.name,
          'short': this.club.short,
          'admins': this.club.admins,
          'requests': this.club.requests,
        }).then(() => {
          console.log('New club registered')
        }).catch((error) => {
            this.error = error

        })

      },
      updateUser() {


        this.$store.dispatch('updateUser').then(() => {
          console.log('userupdate completed')
        }).catch((error) => {
          console.log(error)
        })

      },
      log() {

      },
      addBoat() {
        const newboat = { name: 'Heini Jäger', class: '1X' }
        this.$store.dispatch('addBoat', newboat).then(() => {
          console.log('New boat added successfully')
        }).catch((error) => {
          this.error = error
        })
      },
    },
    
    mounted: function() {
      
    }
}
</script>

<style>

</style>