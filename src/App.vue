<template>
<div id="app" >
  <v-app v-if="loaded">
    

    <Navbar v-if="show"/>

    
    
    <v-main class="ma-0">
      

      <v-snackbar absolute v-model="snackbar.state" :timeout="3000" top :color='snackbar.color' style="z-index:3;">
          <span>{{snackbar.text}}</span>
      </v-snackbar>

      <v-container ma-0 pa-0 fluid style="width:100%; height:100%;">
        
          <router-view></router-view>

      </v-container>

    </v-main>

    <!---
    <Footer v-if="show"/>
    --->

  </v-app>
  
</div>
</template>

<script>
import Navbar from '@/components/Navbar'
import { mapGetters } from "vuex";


//import Footer from '@/components/Footer'

export default {
  name: 'Rowing-Logbook',
  components: { Navbar},
  
  data () {
    return {
      loaded: false,
    }
  },
  computed: {
    ...mapGetters({snackbar: 'getSnackbar'}),
    show () {
      return this.$route.path != '/auth'; 
    },
  },
  methods: {
    checkClubID() {
      const clubid = this.$route.query.cid
      if(clubid != null) {
        const search = this.$store.state.user.clubs.find( club => club.id === clubid)
            if(search != null) {
                this.$store.dispatch('updateActiveClub', search).then(() => {
                  // * Eingegebener Verein zum aktiven Verein geändert
                  this.loaded = true
                }).catch((error) => {
                  console.log(error)
                  this.$store.dispatch('updateSnackbar', {text: 'Es ist ein Fehler aufgetreten!', state: 'true', color: 'error'})
                })
            }
            else {
                this.$store.dispatch('updateSnackbar', {text: 'Du bist kein Mitglied des eingegebenen Verein!', state: 'true', color: 'error'})
            }
      }
      else {
        this.loaded = true
      }

    },
    getData() {
          
          // ? UPDATE DATA AFTER PAGE REFRESH / AND BEFORE LOAD
          

          this.$store.dispatch('getUser').then(() => { 
           
            this.$store.dispatch('getClubs').then(() => {
              
              if(this.$store.state.user.clubs.length > 0) {
                
                if(this.$store.state.user.activeClub.length < 1) { 

                  this.$store.dispatch('updateActiveClub', this.$store.state.user.clubs[0]).then(() => {

                    this.$store.dispatch('getBoats').then(() => {
                      this.$store.dispatch('getReservations').then(() => {
                        
                        this.checkClubID()
                        


                      }).catch((error) => {
                        console.log(error)
                      }) 
          
                    }).catch((error) => {
                      console.log(error)
                      // ! Boote konnte nicht geladen werden!
                    })
                  }).catch((error) => {
                    console.log(error)
                    // ! Update aktiv ausgewählter Verein hat nicht geklappt!
                  })

                } else {
                  this.$store.dispatch('getBoats').then(() => {
                    this.$store.dispatch('getReservations').then(() => {
                      
                        this.$store.commit('setFakts') // * Statistiken setzten

                        this.checkClubID()
                      }).catch((error) => {
                        console.log(error)
                      }) 
                  }).catch((error) => {
                    console.log(error)
                    // ! Boote konnte nicht geladen werden!
                  })
                  
                }


                
              }
              else {
                // ! Nutzer ist keinem Club zugehörig
              }

        
         
             }).catch(() => { 
               // ! Clubs konnten nicht geladen werden - Dann???
             })

          }).catch(() => {
            // ! Konnte keine Daten laden - Und dann??????
          })

          // ? -----------------------------------
   
          
          

        },
      
    },
    created() {

      this.getData()


    },




}
</script>

<style>



html, body {

  margin:0;
  padding:0;
  overflow:hidden;
  background: #121212;
  
}
.v-card__title {
  font-weight: 300 !important;
  text-transform: uppercase;
  font-size: 1.1rem !important;
  letter-spacing: 0.09em !important;
}
.v-btn {
  font-weight: 400 !important;
}
.v-icon {
  padding-bottom:2px;
}
.hover {
  cursor: pointer;
}
.scroll--simple::-webkit-scrollbar {
  width: 6px;
  height: 6px;


}
.scroll--simple::-webkit-scrollbar-track {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.1);
}
.scroll--simple::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background: rgba(0, 0, 0, 0.2);
}
.scroll--simple::-webkit-scrollbar-thumb:hover {
  background: rgba(0, 0, 0, 0.4);
}
.scroll--simple::-webkit-scrollbar-thumb:active {
  background: rgba(0, 0, 0, 0.9);
}


/* ===== Scrollbar CSS ===== */
  /* Firefox */
  * {
    scrollbar-width: auto;
    scrollbar-color: #424242 #3d3d3d;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 12px;
  }

  *::-webkit-scrollbar-track {
    background: #363636;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #424242;
    border-radius: 10px;
    border: 3px solid #363636;
  }

.content {
  z-index:0;
  width:100%; 
  height:100%; 
  overflow-y:auto;
}
</style>

