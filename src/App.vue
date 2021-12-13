<template>
<div id="app">
  <v-app style="height:100vh; overflow-y:scroll; " class="scroll--simple" >
    

    <Navbar v-if="show"/>
 
    

    <v-main class="ma-0">
  
      <v-container ma-0 pa-0 fluid style="width:100%; height:100%;">
        <v-snackbar absolute v-model="snackbar.state" :timeout="1500" top :color='snackbar.color'>
          <span>{{snackbar.text}}</span>
        </v-snackbar>
        
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
  components: { Navbar },
  data () {
    return {
      snackbar: [],
    }
  },
  computed: {
    
    show () {
      return this.$route.path != '/auth'; 
    },
  },
  methods: {
    getSnackbar() {
      this.snackbar = this.$store.state.snackbar
    }
  },
mounted: function() {
    this.getSnackbar()
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

</style>

