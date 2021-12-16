<template>

  <div id="site" style="position:absolute; width:100%; height:100%;">

    <div class="content px-4 px-sm-0">

    <v-btn class="my-4 mx-4" @click="registerClub()">
      Register Club
    </v-btn>
    <v-btn class="my-4 mx-4" @click="updateUser()">
      Update User
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
        boats: [],
        log: [],
        members: [],
        admins: [],
        requests: [],
      },
      error: '',
    }
  },
  methods: {

    registerClub() {

        this.club.name = 'Titania Kieler Klo Gesellschaft'
        this.club.short = 'TKKG'
        
        var user = {}
        user.id = this.$store.state.user.uid
        user.name = this.$store.state.user.firstname+' '+this.$store.state.user.lastname

        this.club.members.push(user)
        this.club.admins.push(user)

        this.$store.dispatch('registerClub', {
          'name': this.club.name,
          'short': this.club.short,
          'boats': this.club.boats,
          'log': this.club.log,
          'members': this.club.members,
          'admins': this.club.admins,
          'requests': this.club.requests,
        }).then(() => {

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
    },
    mounted: function() {
      
    }
}
</script>

<style>

</style>