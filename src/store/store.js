import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import db from '@/fb'

Vue.use(Vuex)
const store = new Vuex.Store({
    
    state: { //Store local Data
        searchBoatInput: { input: '' },
        errorCodes: [
            { code: 'auth/wrong-password', msg: 'Das eingegebene Daten sind falsch' },
            { code: 'auth/user-not-found',  msg:  'E-Mail oder Passwort nicht korrekt' },
            { code: 'auth/too-many-requests',  msg:  'Zu viele Fehlversuche. Anmeldung voerst gesperrt. Bitte versuche es später nocheinmal oder wende dich an den Support' }, 
        ],
        snackbar:[],
        user: [],
        clubs: [],
        boats:[
            {id: '0', class: '1x', name: 'Bootsname', damaged: false, reserved: true },
            {id: '1', class: '2x', name: 'DeinTollesBoot', damaged: false, reserved: false },
            {id: '2', class: '2x', name: 'UnserBoot', damaged: true, reserved: true },
            {id: '3', class: '4x+', name: 'Booti', damaged: true, reserved: true },
            {id: '4', class: '4x', name: 'DasRuderboot', damaged: false, reserved: false },
            {id: '5', class: '6x+', name: 'Ruderboot', damaged: false, reserved: false }, 
            {id: '6', class: '8x+', name: 'Megaboot', damaged: true, reserved: true },
            {id: '7', class: '8+', name: 'YouBoot', damaged: false, reserved: false },
            {id: '8', class: '8+', name: 'DieMannschaft', damaged: true, reserved: true },
        ],
        onwater: [
            { id: '0', class: '2X', boatname: 'DeinTollesBoot', starttime: 1637611638266, dest:['Hörn'], team: ['Max Mustermann', 'Tim Mustermann'] },
        ],


    },
    getters: { //computed (state based - like: sort or flter something)
        getBoatSearchInput(state) {

            return state.searchBoatInput.input;
        },
        
    },
    mutations: { // change state data
        setUser(state, userdata) {
          
            if(!userdata.firstname) { userdata.firstname = null }
            if(!userdata.lastname) { userdata.lastname = null }
            state.user = userdata
        },
        setBoats(state, boats) {
            state.boats.push(boats)
        },
        setNewTour(state, onwater) {
            state.onwater.push(onwater)
        },
        setSnackbar(state, snackbar) {

            state.snackbar.text = snackbar.text
            state.snackbar.color = snackbar.color
            state.snackbar.state = snackbar.state
        },
        setBoatSearchInput(state, search) {
            Vue.set(state.searchBoatInput, 'input', search)
        }
        
    },
    actions: { //methods (dispatch) handle functions and commit data to change to mutations
        loginUser(context, userdata) {
            return new Promise((resolve, reject) => {
                firebase.auth().signInWithEmailAndPassword(userdata.email, userdata.password).then((user) =>{      
                    //context.dispatch('getUser')
                    resolve(user)
                }).catch(error => {
                    
                    reject(error) // console.log(error.code + ' : ' + error.message) // Später in seperater Datei: nach Errorcode Nachricht an Benutzer ausgeben
                })
            })
        },
        registerUser(context, userdata) 
        {
            return new Promise((resolve, reject) => {
                firebase.auth().createUserWithEmailAndPassword(userdata.email, userdata.password).then((user) => {

                    user = firebase.auth().currentUser;
      
                    db.collection('userdata').doc(user.uid).set({

                        firstname: userdata.firstname,
                        lastname: userdata.lastname,
                        email: userdata.email,
                        bday: userdata.bday,
                        profilpic: userdata.profilpic,
                        clubs: userdata.clubs,
                        requests: userdata.requests,


                    }).then((user) => {

                        //context.dispatch('getUser')
                        resolve(user)

                    }).catch((error) => {
                        console.log(error)
                        
                        // ! Benutzer Registrierung hat nicht geklappt! User wieder löschen!

                        reject(error)
                    })
                    
                   

                }).catch((error) => {
                    console.log(error)
                    reject(error)
                })           
            })

        },
        getUser(context) {
    
            return new Promise((resolve, reject) => {
                const uid = firebase.auth().currentUser.uid
                db.collection('userdata').doc(uid).get()
                .then(querySnapshot => {
                    const data = {

                        uid: uid,
                        email: firebase.auth().currentUser.email,
                        firstname: querySnapshot.data().firstname,
                        lastname: querySnapshot.data().lastname,
                        bday: querySnapshot.data().bday,
                        profilpic: querySnapshot.data().profilpic,
                        clubs: querySnapshot.data().clubs,
                        requests: querySnapshot.data().requests,
         
                    }    
                  
                    context.commit('setUser', data)
              

                    resolve(data)
                     
                }).catch(err => {

                    reject(err)
            
                })
            })   
        },

        
        registerClub(context, clubdata) 
        {
            return new Promise((resolve, reject) => {
          
      
            db.collection('clubs').doc().set({

                name: clubdata.name,
                short: clubdata.short,
                boats:clubdata.boats,
                log:clubdata.log,
                members:clubdata.members,
                admins:clubdata.admins,
                requests:clubdata.requests,

            }).then((clubs) => {

                //context.dispatch('getUser')
                resolve(clubs)

            }).catch((error) => {
                console.log(error)
                
                // ! Club Registrierung hat nicht geklappt! Club wieder löschen!

                reject(error)
            })
                    

                    
            })

        },





        updateBoats(context, newboat) {
            context.commit('setBoats', newboat)
        },
        updateOnWater(context, newtour) {
            context.commit('setNewTour', newtour)
        },
        updateSnackbar(context, snackbar) {
            context.commit('setSnackbar', snackbar)
        },
        updateBoatSearchInput(context, search) {
            context.commit('setBoatSearchInput',search)
            
        }
   
    },
})

export default store;