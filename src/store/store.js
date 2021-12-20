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

        user: {

            uid: null,
            firstname: null,
            lastname: null,
            bday: null,
            profilpic: null,
            email: null,
            clubs: [],
            requests: [],
            activeClub: [],
        },
        
        clubs: [],

        boats:[],

        onwater: [
            { id: '0', class: '2X', boatname: 'DeinTollesBoot', starttime: 1637611638266, dest:['Hörn'], team: ['Max Mustermann', 'Tim Mustermann'] },
        ],


    },
    getters: { //computed (state based - like: sort or flter something)
        getBoatSearchInput(state) {

            return state.searchBoatInput.input;
        },
        getBoats(state) {
            return state.boats
        },
        getSnackbar(state)  {
            return state.snackbar
        }
        
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
            if(!userdata.activeClub || userdata.activeClub === '') { userdata.activeClub = [] }
            
            // * ---------------------------------------------------------------------------------------------------

            state.user = userdata

        },
        setBoats(state, boats) {
            state.boats = boats
        },
        setSnackbar(state, snackbar) {
            Vue.set(state.snackbar, 'text', snackbar.text)
            Vue.set(state.snackbar, 'color', snackbar.color)
            Vue.set(state.snackbar, 'state', snackbar.state)
        },
        setBoatSearchInput(state, search) {
            Vue.set(state.searchBoatInput, 'input', search)
        },

        
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
                        activeClub: querySnapshot.data().activeClub,
         
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
                    activeClub: userdata.activeClub,

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
          
            const data = {
                name: clubdata.name,
                short: clubdata.short,
                admins:clubdata.admins,
                requests:clubdata.requests,
            }
            db.collection('clubs').add(data).then((result) => {

                var newClub = { id: result.id, name: data.name, short: data.short }
                

                context.state.user.clubs.push(newClub)

                context.dispatch('updateUser').then(() => { 
                    resolve() 
                }).catch((error) => {
                    reject(error)
                })

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

                            id: club.id,        
                            name: querySnapshot.data().name,
                            short: querySnapshot.data().short,

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
        updateActiveClub(context, club) {
            
            return new Promise((resolve, reject) => {
                context.state.user.activeClub = club
                context.dispatch('updateUser').then(() => {
                    resolve()
                }).catch((error) => {
                    reject(error)
                })
            })
        },


        addBoat(context, newboat) {

            return new Promise((resolve, reject) => {
          
                const data = {
                    name: newboat.name,
                    class: newboat.class,
                    damaged:false,
                    damage_desc:null,
                    onwater: false,
                    clubid: context.state.user.activeClub.id

                }
                db.collection('boats').add(data).then(() => {
                    context.dispatch('getBoats').then(() => {
                        
                        resolve()

                    }).catch((error) => {
                        reject(error)
                    })
                    
                           
                }).catch((error) => {

                    // ! Neues Boot hinzufügen hat nicht geklappt -> Was dann ?
    
                    reject(error)
                })
           
                })        

        },
        getBoats(context) {
            var activeClub = context.state.user.activeClub.id
            context.state.boats = []
            var boats = []
            return new Promise((resolve, reject) => {

                    db.collection("boats").where("clubid", "==", activeClub)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const data = doc.data()
                            const newBoat = {
                                id: doc.id,
                                name: data.name,
                                class: data.class,
                                damaged: data.damaged,
                                damage_desc: data.damage_desc,
                                onwater: data.onwater,
                                clubid: data.clubid,
                            }

                            boats.push(newBoat)
                            
                        });
                        context.commit('setBoats', boats)
                    
                        resolve()
                    })
                    .catch((error) => {
                        reject()
                        console.log("Error getting documents: ", error);
                    });

            }) 
        },
        deleteBoat(context, boat) {
            return new Promise((resolve, reject) => {
                db.collection("boats").doc(boat.id).delete().then(() => {
                    context.dispatch('getBoats').then(() => {
                        resolve()
                    }).catch((error) => {
                        reject(error)
                    })
                }).catch((error) => {
                    reject(error)
                });
            })
        },
        editBoatDamage(context, boat) {
            return new Promise((resolve, reject) => {
                db.collection("boats").doc(boat.id).update({
                    damaged: boat.damaged,
                    damage_desc: boat.damage_desc
                }).then(() => {
                    context.dispatch('getBoats').then(() => {
                        resolve()
                    }).catch((error) => {
                        reject(error)
                    })
                }).catch((error) => {
                    reject(error)
                });
            })            
        },
        updateOnWater() {
            
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