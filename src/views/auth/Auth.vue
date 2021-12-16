<template>
   
<div style="width:100%; height:100%; display:flex; overflow:hidden;">

<v-layout wrap>
 

  <h2 class="font-weight-light text-uppercase d-sm-block ma-4" style="position:absolute; top:0; right:0;">ROWING<b>LOGBOOK</b></h2>

  <v-snackbar v-model="snackbar" :timeout="4000" top color="error">
      <span>{{snackbarText}}</span>
  </v-snackbar>

<v-row>
  <v-spacer></v-spacer>
  <v-col class="d-flex align-center col-sm-9 col-md-7 col-lg-5  col-12">

    <v-card flat style="width:100%;" v-bind:class='{ fullHeight : !$vuetify.breakpoint.smAndUp }'>
      <v-toolbar flat class="d-flex justify-center text-uppercase" v-if="$vuetify.breakpoint.smAndUp">
        <v-toolbar-title v-if="loginForm">Anmelden</v-toolbar-title>
        <v-toolbar-title v-if="!loginForm">Willkommen</v-toolbar-title>         
        </v-toolbar>
        <div style="width:100%" v-bind:class='{ flexContent : !$vuetify.breakpoint.smAndUp }'>
            
            <v-card-text class="pt-sm-8 px-sm-16 px-10">
              <v-form  @submit.prevent="loginForm ? login() : register()" id="login-form" ref="form">

                <v-text-field clearable name="firstname" v-model="user.firstname" label="Vorname" type="text" v-if="!loginForm" ></v-text-field>
                <v-text-field clearable name="lastname" v-model="user.lastname" label="Nachname" type="text" v-if="!loginForm" ></v-text-field>
                <v-text-field clearable name="email" v-model="user.email" label="E-Mail Adresse" type="text" ></v-text-field>
                <v-text-field clearable name="password" v-model="user.password" label="Passwort" id="password" type="password" ></v-text-field>
                
                <!-- 
                  //TODO Rules für Passwort, Name, E-Mail vorerst entfernt. Später fertiges Validate JS einfügen und nutzen !!! 
                -->
                

              </v-form>
            </v-card-text>
          <div style="width:100%">
            <v-card-actions class="pa-4 d-flex justify-center">
              <v-btn class="px-16" tile elevation="0" outlined v-if="loginForm" type="submit" form="login-form" :loading="loading">Anmelden</v-btn>
              <v-btn class="px-16" tile elevation="0" outlined v-if="!loginForm" type="submit" form="login-form" :loading="loading">Registrieren</v-btn>
            </v-card-actions>
            <div class="pa-4 text-center">
              <p class="text-xs-centert" @click="changeForm" v-if="!loginForm"><a style="color: lightgrey">Du besitzt bereits einen Account?<br>Melde dich hier an!</a></p>
              <p class="text-xs-centert" @click="changeForm" v-if="loginForm"><a style="color: lightgrey">Du besitzt noch keinen Account?<br>Registriere dich hier!</a></p>
            </div>
          </div>

        </div>
      </v-card>

  </v-col>
  <v-spacer></v-spacer>
</v-row>


</v-layout>

</div>



</template>

<script>



export default {
  data() {
    return {
      error: false,
      user: {
        password: null,
        email: null,
        firstname: null,
        lastname: null,
        bday: null,
        profilpic: null,
        clubs: [],
        requests: [],
      },


      loginForm: true,

      loading: false,
      snackbar: false,
      snackbarText: '',

    }
  },  
  methods: {
    login() {

      this.loading = true;
        
      this.$store.dispatch('loginUser',{
        'email': this.user.email,
        'password': this.user.password,
      }).then(() => {

        this.loading = false;
        this.$router.push('/')

        //this.alrt('Erfolgreich Angemeldet','done')
      
      }).catch(error => {
        let errmsg = this.$store.state.errorCodes.find(err => err.code === error.code)
        this.loading = false;
        
        if(errmsg == null) { 

          this.snackbarText = 'Ein unbekannter Fehler ist aufgetreten!';
          this.snackbar = true;

        } else {

          this.snackbarText = errmsg.msg
          this.snackbar = true;
          this.user.password = ''

        }

      })
    },
    
    register() {

      this.loading = true;

      this.$store.dispatch('registerUser', {
        'firstname': this.user.firstname,
        'lastname': this.user.lastname,
        'email': this.user.email,
        'password': this.user.password,
        'bday': this.user.bday,
        'profilpic': this.user.profilpic,
        'clubs': this.user.clubs,
        'requests': this.user.requests,

      }).then(() => {

        //this.alrt("Du hast dich erfolgreich registriert!","done")

        this.loading = false;
        this.$router.push('/')

      }).catch(() => {

        this.snackbarText = 'Es ist ein Fehler aufgetreten!' //Genauere Fehler  Code Analyse folgt! (Siehe Login Error)
        this.snackbar = true;
        this.user.password = ''

      })

    },


    changeForm () {
      this.loginForm = !this.loginForm;
      this.$refs.form.reset()
    },
  }


}
          


</script>


<style>
.fullHeight {
  height:100%;

}
.flexContent {
  height:90%;
  display: flex;
  align-content: center;
  flex-wrap: wrap;
  justify-content: center;
  flex-direction: row;
}

  @media only screen and (max-width: 768px) {
    .v-main {
      margin: 0;
      padding:0;
    }
  }

</style>

