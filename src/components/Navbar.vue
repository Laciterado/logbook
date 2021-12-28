<template>
<div>


      <v-dialog
        v-model="dialog"
        max-width="600px"
      >
        <v-card>
          <v-card-title class="overline py-4 success--text">Verein beitreten</v-card-title>
          <v-card-text>
         
            <v-text-field
              label="Vereins-ID eingeben"
              autofocus
            ></v-text-field>
            <span class="caption font-weight-light">Eine Vereins-ID bekommst du von einem Mitglied des Vereins</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="dialog = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn
            color="success"
              text
              @click="dialog = false"
            >
              <v-icon>done</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog
        v-model="dialog2"
        max-width="600px"
      >
        <v-card>
          <v-card-title class="overline py-4 success--text">Verein verlassen</v-card-title>
          <v-card-text class="d-flex flex-column">
            <span class="py-2">Möchtest du den Verein:</span>
            <span class="warning--text py-2">{{user.activeClub.name}}</span>
            <span class="py-2">wirklich verlassen?</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="dialog2 = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
            <v-btn
              color="error"
              text
              @click="leaveClub()"
            >
              <v-icon>done</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>


  <v-navigation-drawer
  
    v-model="drawer"
    fixed
    left
    temporary
    app
    id="navbar"
  >

    <template v-slot:prepend>
      <div class="d-none d-sm-block">
        <v-flex class="pt-6 d-flex justify-content align-center flex-column">
          <v-avatar size="130">
            <img :src="photoURL">
          </v-avatar>
          <p class="overline font-weight-light font-italic ma-0 pa-0 mt-8 ">Willkommen</p>
          <p class="overline  ma-0 pa-0">
            {{ user.firstname + ' ' + user.lastname}}
          </p>
        </v-flex>
      </div>
      
      <v-flex class="pt-8 px-8">
        <span class="d-block d-sm-none font-weight-normal text-uppercase success--text mb-4">MENU</span>
        <v-btn block color="success" elevation="0" :to="'/addtour'" class="d-none d-sm-flex mb-6">
        Fahrt beginnen
        </v-btn>
      </v-flex>
    </template>

  <v-container class="pa-0 ma-0 pt-4">

    <v-list class="pa-0 ma-0">
      <v-list-item
        v-for="item in links"
        :key="item.name"
        link
        :to="item.route"
        class="ma-0 px-0 pl-8 pr-8"
      >
        
        <v-list-item-icon>
          <v-icon >{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title class="text-right overline font-weight-light">{{ item.text }}</v-list-item-title>
        </v-list-item-content>


      </v-list-item>
    </v-list>


    </v-container>

  
    <!-- <template v-slot:append >
      <div class="pb-8 px-8 pt-6">
        <v-btn block @click="signout()" color="error" elevation="0">
          Abmelden
        </v-btn>
      </div>
    </template> -->


    </v-navigation-drawer>

    <v-app-bar dense fixed app elevate-on-scroll>

        <v-app-bar-nav-icon class="success--text" @click.stop="drawer = !drawer" v-if="showMenu"><v-icon>waves</v-icon></v-app-bar-nav-icon>
        <span class="font-weight-light text-uppercase pl-2 d-none d-sm-block" v-if="showMenu">{{ this.routename() }}</span>
  
        <v-btn v-if="!showMenu" icon @click="back()" ><v-icon class="success--text">chevron_left</v-icon></v-btn>
        <span v-if="!showMenu" class="font-weight-light text-uppercase pl-2 d-none d-sm-block hover " @click="back()">ZURÜCK</span>
        
        <v-spacer v-if="!$vuetify.breakpoint.smAndDown"></v-spacer>

        <div class="d-flex align-center" v-if="showClub">
          
          <v-menu
            bottom
            :offset-y="true"
            v-if="user.clubs.length > 1 || user.clubs == null"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                v-bind="attrs"
                v-on="on"
                class="pa-0 pl-1 mx-1"
                elevation="0"
              >
                {{user.activeClub.short}}
                <v-icon class="ml-2">arrow_drop_down</v-icon>
              </v-btn>
              
            </template>

            <v-list >
              <v-list-item
                class="hover vmenu"
                v-for="(item, i) in clubs"
                :key="i"
                @click="changeActiveClub(item.id)"
              >
                <v-list-item-title class="overline text-center">{{ item.short }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <v-spacer v-if="$vuetify.breakpoint.smAndDown"></v-spacer>


        <v-btn v-if="route == 'logbook'" icon :to="'/addtour'"><v-icon class="success--text">add</v-icon></v-btn>
        <v-btn v-if="route == 'boats'" icon @click="searchBar = !searchBar"><v-icon class="pt-1" :class="{'success--text': searchBar}">search</v-icon></v-btn>       
        <v-btn v-if="route == 'boats'" icon :to="'/addboat'"><v-icon class="success--text">add</v-icon></v-btn>       
        <v-btn v-if="route == 'reservations'" icon :to="'/addreservation'" class="success--text"><v-icon >add</v-icon></v-btn>

        <v-btn v-if="route == 'clubs'" icon :to="'/addclub'"><v-icon >add_business</v-icon></v-btn>
        <v-btn v-if="route == 'clubs'" icon @click="dialog2 = true" ><v-icon >group_remove</v-icon></v-btn>
        <v-btn v-if="route == 'clubs'" icon @click="dialog = true" class="success--text"><v-icon >group_add</v-icon></v-btn>
        
        

      <template v-slot:extension v-if="searchBar" >

        <v-text-field
        autofocus
        v-model="search"
        
        label="Boot suchen"
        append-icon='close'
        @click:append="resetSearch()"
        single-line
        hide-details
        @input="setSearchInput()"
        
      ></v-text-field>
    
      </template>


    </v-app-bar>


</div>

</template>

<script>
import { mapGetters } from "vuex";
import firebase from "firebase/app"


export default {
  data: () => ({
    newroute: '',
    oldroute: '',
    search: '',
    dialog: false,
    dialog2: false,
    searchBar: false,
    drawer: false,
    group: null,
    photoURL: "https://imgur.com/dLB4u3s.png",
    links: [
        { name: 'logbook', icon: 'rowing', text: 'Fahrtenbuch', route: '/' },
        { name: 'boats', icon: 'reorder', text: 'Bootspark', route: '/boats'},
        { name: 'reservations', icon: 'bookmark_border', text: 'Reservierungen', route: '/reserve' },
        { name: 'damage', icon: 'report_problem', text: 'Schaden melden', route: '/damage'},
        { name: 'statistics', icon: 'assessment', text: 'Statistiken', route: '/statistics'},
        { name: 'clubs', icon: 'home', text: 'Verein', route: '/clubs' },
        { name: 'settings', icon: 'person', text: 'Profil', route: '/settings' },
    ],
    
  
  }),
  watch: {
    group () {
      this.drawer = false
    },
  },
  computed: {
    ...mapGetters({clubs: 'getClubs'}),
    ...mapGetters({user: 'getUser'}),
    

    route() {
      return this.$route.name
    },
    showMenu() {
      if(this.$route.name == 'addboat') { return false }
      else if(this.$route.name == 'addtour') { return false }
      else if(this.$route.name == 'addreservation') { return false }
      else if(this.$route.name == 'addclub') { return false }
      return true
    },
    showClub() {
      if(this.$route.name == 'addboat') { return false }
      else if(this.$route.name == 'addreservation') { return false }
      else if(this.$route.name == 'addtour') { return false }
      else if(this.$route.name == 'settings') { return false }
      else if(this.$route.name == 'addclub') { return false }
      return true
    },

  },

  methods: {
    leaveClub() {
      this.$store.dispatch('leaveClub')
    },
    routename() {
      if(this.$route.name == 'logbook') { return 'Fahrtenbuch' }
      else if(this.$route.name == 'reservations') { return 'Reservierungen' }
      else if(this.$route.name == 'addreservation') { return 'Neue Reservierung' }
      else if(this.$route.name == 'boats') { return 'Bootspark' }
      else if(this.$route.name == 'addboat') { return 'Boot hinzufügen' }
      else if(this.$route.name == 'damage') { return 'Schaden melden' }
      else if(this.$route.name == 'statistics') { return 'Statistiken' }
      else if(this.$route.name == 'settings') { return 'Einstellungen' }
      else if(this.$route.name == 'clubs') { return 'Verein' }
      else { return '' }
      
    },
    leavedSite() {
      if(this.newroute === '') { this.newroute = this.$route.name }
      if(this.newroute != this.$route.name) {

        // ! SEITE WURDE GEWECHSELT! -> Daten zurücksetzten
          this.searchBar = false
          this.search = ''
          this.$store.dispatch('updateBoatSearchInput', this.search)

        //! -----------------------
        this.newroute = this.$route.name
      }

      

    },
    resetSearch() {
      this.searchBar = !this.searchBar
      this.search = ''
      this.$store.dispatch('updateBoatSearchInput', this.search)
    },
    setSearchInput() {

      this.$store.dispatch('updateBoatSearchInput', this.search)
    },
    back() {
      
      history.back();
    },
    signout() {
      firebase.auth().signOut().then(() => {
        this.$router.replace('/auth')

        
      })
    },
    changeActiveClub(id) {

      const newClub = this.$store.state.clubs.find( club => club.id === id)
      this.$store.dispatch('updateActiveClub', newClub).then(() => {

        this.$store.dispatch('getBoats').then(() => {

          this.$store.dispatch('getReservations').then(() => {
            this.$store.commit('setFakts')
        }).catch((error) => {
          console.log(error)
        })
        }).catch((error) => {
          console.log(error)
        })
      }).catch((error) => {
        console.log(error)
      })
      
    },
    
  },
 
  mounted: function() {
    
    this.leavedSite()


  },
  updated: function() {

    this.leavedSite()
  },
  
}
</script>

<style>


.v-navigation-drawer__border {
  display: none;
}

.club .v-text-field__details {
  display: none;
}
.v-list-item--active {

  color:#06d6a0 !important;
}
.v-toolbar__extension {
  background: #363636;
}
.expandedListItem .v-list-group__header__append-icon {
  display: none
}
.club .v-input__slot {
  padding-top:4px;
}
.club .v-input__slot:before {
  display:none
}
.club .v-input__slot:after {
  display:none
}
.club .v-select__selection {
  font-weight: 300;
}
.vmenu:hover {
  background:#363636;
}
</style>
