<template>
<div id="app" >
  <v-app v-if="loaded">
    

    <Navbar v-if="show"/>

    
    
    <v-main class="ma-0">
      

      <v-snackbar absolute v-model="snackbar.state" :timeout="1500" top :color='snackbar.color'>
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



//import Footer from '@/components/Footer'

export default {
  name: 'Rowing-Logbook',
  components: { Navbar},
  
  data () {
    return {
      snackbar: [],
      loaded: false,
    }
  },
  computed: {
    
    show () {
      return this.$route.path != '/auth'; 
    },
  },
  methods: {
    getSnackbar() {
      
    },
  
    getData() {
          
          // ? UPDATE DATA AFTER PAGE REFRESH / AND BEFORE LOAD
          

          this.$store.dispatch('getUser').then(() => { 
           
            this.$store.dispatch('getClubs').then(() => {
              
              if(this.$store.state.user.clubs.length > 0) {
                
                if(this.$store.state.user.activeClub.length < 1) { 

                  this.$store.dispatch('updateActiveClub', this.$store.state.user.clubs[0]).then(() => {
                    this.$store.dispatch('getBoats').then(() => {
                      this.loaded = true
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
                    this.loaded = true
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
   
          this.snackbar = this.$store.state.snackbar
          

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


.content {
  z-index:0;
  width:100%; 
  height:100%; 
  overflow-y:auto;
}
</style>

