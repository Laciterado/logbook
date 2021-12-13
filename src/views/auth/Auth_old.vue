<template>
  




<v-layout wrap>
  <v-snackbar v-model="snackbar" :timeout="4000" top color="error">
      <span>{{snackbarText}}</span>
  </v-snackbar>

<v-row>
  <v-spacer></v-spacer>
  <v-col class="d-flex align-center col-sm-9 col-md-7 col-lg-5  col-12">

    <v-card flat style="width:100%;" v-bind:class='{ fullHeight : !$vuetify.breakpoint.smAndUp }'>
      <v-toolbar flat class="d-flex justify-center text-uppercase" v-if="$vuetify.breakpoint.smAndUp">
        <v-toolbar-title v-if="login">Anmelden</v-toolbar-title>
        <v-toolbar-title v-if="!login">Willkommen</v-toolbar-title>         
        </v-toolbar>
        <div style="width:100%" v-bind:class='{ flexContent : !$vuetify.breakpoint.smAndUp }'>
            
            <v-card-text class="pt-sm-8 px-sm-16 px-10">
              <v-form  @submit.prevent="login? signin() : register()" id="login-form" ref="form">

                <v-text-field clearable name="firstname" v-model="firstname" label="Vorname" type="text" :rules="nameRules" v-if="!login" ></v-text-field>
                <v-text-field clearable name="lastname" v-model="lastname" label="Nachname" type="text" :rules="nameRules" v-if="!login" ></v-text-field>
                <v-text-field clearable name="email" v-model="email" label="E-Mail Adresse" type="text" :rules="emailRules" ></v-text-field>
                <v-text-field clearable name="password" v-model="password" label="Passwort" id="password" type="password" :rules="passwordRules" ></v-text-field>
              </v-form>
            </v-card-text>
          <div style="width:100%">
            <v-card-actions class="pa-4 d-flex justify-center">
              <v-btn class="px-16" tile elevation="0" outlined v-if="login" type="submit" form="login-form" :loading="loading">Anmelden</v-btn>
              <v-btn class="px-16" tile elevation="0" outlined v-if="!login" type="submit" form="login-form" :loading="loading">Registrieren</v-btn>
            </v-card-actions>
            <div class="pa-4 text-center">
              <p class="text-xs-centert" @click="changeForm" v-if="!login"><a style="color: lightgrey">Du besitzt bereits einen Account?<br>Melde dich hier an!</a></p>
              <p class="text-xs-centert" @click="changeForm" v-if="login"><a style="color: lightgrey">Du besitzt noch keinen Account?<br>Registriere dich hier!</a></p>
            </div>
          </div>

        </div>
      </v-card>

  </v-col>
  <v-spacer></v-spacer>
</v-row>

</v-layout>





</template>

<script>
import {firebase} from "@/fb"


export default {
  data() {
    return {
        login: true,
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        loading: false,
        snackbar: false,
        snackbarText: '',
        nameRules: [ v => { return v.length >= 2 || 'Zu kurz ( min. 2 Buchstaben)' } ],
        emailRules: [
          value => {
            const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            return pattern.test(value) || 'Keine gültige E-Mail Adresse';
          }
        ],
        passwordRules: [ v => { return v.length >= 2 || 'Zu kurz ( min. 2 Buchstaben)' } ],
    }
  },  
  methods: {
    register() {
      if(this.name.length >= 2) {
        this.loading = true;
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((user) => {
          user = firebase.auth().currentUser;
          if(user){
            user.updateProfile({
            displayName: this.name,
            }).then(() => {
              this.loading = false;
              this.$router.replace('/dashboard');
            })
          } 
        })
        .catch((error) => {
          // Handle Errors here.
          var errorMessage = error.message;
          this.loading = false;
          if (errorMessage.length > 0) {
            this.snackbarText = errorMessage;
            this.snackbar = true;
          }
        })
      } else {
        this.snackbarText = 'Name too short'
        this.snackbar = true;
      }
    },
    signin() {
      this.loading = true;
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(() => {
        this.loading = false;
        this.$router.replace('/dashboard')
      }).catch(function(error) {
        return error.message;
      }).then( error => {
        this.loading = false;
        this.snackbarText = error;
        this.snackbar = true;
      })
    },
    changeForm () {
      this.login = !this.login;
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

