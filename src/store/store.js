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
          
            // * Leere erhaltene Daten als "Leer" definieren, damit sie in Firestore wieder gespeichert werden können

            if(!userdata.firstname || userdata.firstname === '') { userdata.firstname = null }
            if(!userdata.lastname || userdata.lastname === '') { userdata.lastname = null }
            if(!userdata.bday || userdata.bday === '') { userdata.bday = null }
            if(!userdata.clubs || userdata.clubs === '') { userdata.clubs = [] }
            if(!userdata.requests || userdata.requests === '') { userdata.requests = [] }
            if(!userdata.profilpic || userdata.profilpic === '') { userdata.profilpic = null }
            if(!userdata.email || userdata.email === '') { userdata.email = null }
            
            // * ---------------------------------------------------------------------------------------------------

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
        updateUser(context) 
        {
            var userdata = context.state.user

            return new Promise((resolve, reject) => {

                var user = firebase.auth().currentUser;
    
                db.collection('userdata').doc(user.uid).set({

                    firstname: userdata.firstname,
                    lastname: userdata.lastname,
                    email: userdata.email,
                    bday: userdata.bday,
                    profilpic: userdata.profilpic,
                    clubs: userdata.clubs,
                    requests: userdata.requests,

                }).then(() => {

                    // * UPDATE hat geklappt!
                    // * Alle Daten aktualisieren die vom Benutzer abhängig sind, zB Clubs, Boote etc.
                    context.dispatch('getClubs').then(() => {
                        // * HIER WEITERE DATEN LADEN 
                        resolve()
                    }).catch((error) => {
                        // ! Fehler beim laden der Clubs aufgetreten!
                        console.log(error)
                        reject(error)
                    })                                      
                }).catch((error) => {
                    console.log(error)

                    reject(error)
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
        getClubs(context) {
            var user = context.state.user
            return new Promise((resolve, reject) => {
                user.clubs.forEach(club => {
                    
                        db.collection('clubs').doc(club.id).get()
                        .then(querySnapshot => {
                            const data = {

                            // ! Club ID aus Doc Name lesen !!!! Fehlt hier noch! !!!!!!!!!!!!!!!!!

                            name: querySnapshot.data().name,
                            short: querySnapshot.data().short,
                            boats: querySnapshot.data().boats,
                            log: querySnapshot.data().log,
                            members: querySnapshot.data().members,
                            admins: querySnapshot.data().admins,
                            requests: querySnapshot.data().requests,

                            }    
                            context.state.clubs.push(data)
                            //context.commit('setUser', data)
                            
                        }).catch(err => {
                            
                            reject(err) // * Ein Fehler ist aufgetreten! Abbruch der Schleife und Rückmeldung eines Errors
                    
                        })
                    
                });
                resolve(); // * Alle Clubs geladen - Positive Rückmeldung geben!
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