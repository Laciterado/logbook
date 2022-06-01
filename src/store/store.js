import Vue from 'vue'
import Vuex from 'vuex'
import firebase from 'firebase/app'
import db from '@/fb'


Vue.use(Vuex)
const store = new Vuex.Store({
    
    state: { //Store local Data
        overlay: true,
        authstate: false,
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
            clubs: null,
            requests: [],
            activeClubID: null,

        },
        activeClub: { id: null, name: null, short: null, members: [], admins: []},

        events: [],

        boats:[],

        fakts: [
            {name: 'Mitglieder', count: 0 },
            {name: 'Admins', count: 0 },
            {name: 'Boote', count: 0 },
            {name: 'Beschädigte Boote', count: 0 },
            {name: 'Gesperrte Boote', count: 0 },
        ],

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
        },
        getEvents(state) {
            return state.events
        },
        getClubs(state) {
            return state.user.clubs
        },
        getUser(state) {

            return state.user
        },
        getFakts(state) {
            return state.fakts
        },
        getOverlay(state) {
            return state.overlay
        },
        getAuthState(state) {
            return state.authstate
        },
        getActiveClub(state) {

            return state.activeClub
            
        },



        
    },
    mutations: { // change state data
        setUser(state, userdata) {
          
            // * Leere erhaltene Daten als "Leer" definieren, damit sie in Firestore wieder gespeichert werden können

            if(!userdata.firstname || userdata.firstname === '') { userdata.firstname = null }
            if(!userdata.lastname || userdata.lastname === '') { userdata.lastname = null }
            if(!userdata.bday || userdata.bday === '') { userdata.bday = null }
            if(!userdata.requests || userdata.requests === '') { userdata.requests = [] }
            if(!userdata.profilpic || userdata.profilpic === '') { userdata.profilpic = null }
            if(!userdata.email || userdata.email === '') { userdata.email = null }
            
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
        setEvents(state, events) {
            state.events = events
        },
        setClubs(state, clubs) {
            state.user.clubs = clubs
        },

        setActiveClub(state, club) {

            Vue.set(state.activeClub,'id', club.id )
            Vue.set(state.activeClub,'name', club.name)
            Vue.set(state.activeClub,'short', club.short)
            Vue.set(state.activeClub,'members', club.members)
            Vue.set(state.activeClub,'admins', club.admins)
            
        },
        setFakts(state) {
     
            if(state.user.clubs != null) {
                let locked_boats = 0
                let damaged_boats = 0
                state.boats.forEach(boat => {
                    if(boat.locked == true) { locked_boats++ }
                });
                state.boats.forEach(boat => {
                    if(boat.damaged == true) { damaged_boats++ }
                });
                let newfakts = [
                    {name: 'Mitglieder', count: state.activeClub.members.length },
                    {name: 'Admins', count: state.activeClub.admins.length },
                    {name: 'Boote', count: state.boats.length },
                    {name: 'Beschädigte Boote', count: damaged_boats },
                    {name: 'Gesperrte Boote', count: locked_boats },
                ]
                state.fakts = newfakts
            }
            
        },
        setOverlay(state, boolean) {
            state.overlay = boolean
        },
        setAuthState(state, boolean) {
            state.authstate = boolean
        
        }
    },
    actions: { //methods (dispatch) handle functions and commit data to change to mutations
        loginUser(context, userdata) {
            return new Promise((resolve, reject) => {
                firebase.auth().signInWithEmailAndPassword(userdata.email, userdata.password).then((user) =>{      
                    //context.dispatch('getUser')
                    resolve(user)
                    context.state.authstate = true
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
                        requests: userdata.requests,

                    }).then((user) => {
                        context.state.authstate = true
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
                        requests: querySnapshot.data().requests,
                        activeClubID: querySnapshot.data().activeClubID,
                    }    
                    context.commit('setUser', data)
                   
                    context.dispatch('getUserClubs').then(() => {
                        if(context.state.user.clubs != null) {
                            context.dispatch('getActiveClubData', data.activeClubID).then(() => {
                                resolve()
                   
                            }).catch((error) => {console.log(error); reject(error)})   
                        }
                        else { resolve() }
                         
                    }).catch((error) => {console.log(error); reject(error)})
                    

                }).catch((error) => {console.log(error); reject(error)})
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
                    requests: userdata.requests,
                    activeClubID: userdata.activeClubID,

                }).then(() => {
                    
                    resolve()              
                }).catch((error) => { console.log(error); reject(error) })
            })           
        },        
        
        registerClub(context, clubdata) 
        {
            return new Promise((resolve, reject) => {
          
            const data = {
                name: clubdata.name,
                short: clubdata.short,
            }
            db.collection('clubs').add(data).then((club_result) => {

                db.collection('clubs').doc(club_result.id).collection('members').doc(context.state.user.uid).set({ id: context.state.user.uid}).then(() => { 
                    db.collection('clubs').doc(club_result.id).collection('admins').doc(context.state.user.uid).set({ id: context.state.user.uid}).then(() => { 
                        db.collection('userdata').doc(context.state.user.uid).collection('clubs').doc(club_result.id).set({ id: club_result.id}).then(() => {
                            context.dispatch('getUserClubs').then(() => {
                                context.dispatch('setActiveClub', club_result.id ).then(() => {
                                    resolve()
                                }).catch((error) => { console.log(error); reject(error) })
                            }).catch((error) => {console.log(error); reject(error)})
                        }).catch((error) => { console.log(error); reject(error) })    
                    }).catch((error) => { console.log(error); reject(error) })
                }).catch((error) => { console.log(error); reject(error) })

            }).catch((error) => {
                console.log(error)
                
                // ! Club Registrierung hat nicht geklappt! Club wieder löschen!
                // ! Neue Funktion erstelle: Bei jedem Error Dokument komplett löschen! (deleteClub())

                reject(error)
            })
       
            })

        },
        getUserClubs(context) {
            return new Promise((resolve, reject) => {
                let userclubs = []
                db.collection('userdata').doc(context.state.user.uid).collection('clubs').get().then((clubs) => {
                    clubs.forEach((doc) => {
                        db.collection('clubs').doc(doc.id).get().then((clubdata) => {
                            userclubs.push({
                                id: doc.id,
                                name: clubdata.data().name,
                                short: clubdata.data().short
                            })
                        }).catch((error) => { console.log(error); reject(error) })
                    })
                    if(userclubs != []) { context.commit('setClubs', userclubs); }
                    resolve()
                }).catch((error) => { console.log(error); reject(error) })    
            })
        },
        setActiveClub(context, id) {
            return new Promise((resolve, reject) => {
                context.dispatch('getActiveClubData', id).then(() => {
                    resolve()
                }).catch((error) => { reject(); console.log(error) })
            })
        },
        getActiveClubData(context,id) {
           
            return new Promise((resolve, reject) => {
                db.collection('clubs').doc(id).get().then((clubdata) => {
                    db.collection('clubs').doc(id).collection('members').get().then((members) => {
                        db.collection('clubs').doc(id).collection('admins').get().then((admins) => {

                            let clubmembers = []
                            members.forEach((doc) => {
                                db.collection('userdata').doc(doc.id).get().then((data) => {
                                    clubmembers.push({
                                        id: doc.id,
                                        firstname: data.data().firstname,
                                        lastname: data.data().lastname,
                                    })
                                }).catch((error) => {console.log(error)})
                            });

                            let clubadmins = []
                            admins.forEach((doc) => {
                                db.collection('userdata').doc(doc.id).get().then((data) => {
                                    clubadmins.push({
                                        id: doc.id,
                                        firstname: data.data().firstname,
                                        lastname: data.data().lastname,
                                    })
                                }).catch((error) => {console.log(error)})
                            });

                            let activeclub = {
                                id: id,
                                name: clubdata.data().name,
                                short: clubdata.data().short,
                                members: clubmembers,
                                admins: clubadmins,
                            }

                            context.commit('setActiveClub',activeclub)
                     
                            let userdata = context.state.user
                            
                            userdata.activeClubID = id
                           
                            context.commit('setUser', userdata)

                            context.dispatch('updateUser').then(() => {
                                context.dispatch('getBoats').then(()=> {
                                    context.dispatch('getReservations').then(()=> {
                                        context.commit('setFakts')
                                        resolve()
                                    }).catch((error) => { console.log(error); reject()})
                                }).catch((error) => { console.log(error); reject()})
                            }).catch((error) => { reject(); console.log(error) })

                        }).catch((error) => { reject(); console.log(error) })
                        
                    }).catch((error) => { console.log(error); reject() })
            
                }).catch((error) => { console.log(error); reject() })

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
                    clubid: context.state.user.activeClubID,
                    locked: false,

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
            
            
            return new Promise((resolve, reject) => {
                if(context.state.user.clubs != null)
                {     
                    var activeClub = context.state.user.activeClubID
              
                    context.state.boats = []
                    var boats = []

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
                                    locked: data.locked,
                                }

                                boats.push(newBoat)
                                
                            });
                            if(boats == [] || boats.length < 1) {
                                resolve()
                            }
                            else {
                                context.commit('setBoats', boats)
                                context.commit('setFakts')
                                resolve()
                            }
                            
                        })
                        .catch((error) => {
                            reject()
                            console.log("Error getting documents: ", error);
                        });
                }
                else {
                    resolve()
                }           
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
                    damage_desc: boat.damage_desc,
                    locked: boat.locked
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
        lockBoat(context, boat) {
            return new Promise((resolve, reject) => {
                const state =! boat.locked
                db.collection("boats").doc(boat.id).update({
                    locked: state,
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
        addReservation(context, event) {
            
            return new Promise((resolve, reject) => {
                var activeClub = context.state.user.activeClubID
                const data = {
                    clubid: activeClub,
                    boatid: event.boatid,
                    name: event.name,
                    start: event.start,
                    end:event.end,
                    color:event.color,
                    timed: event.timed,
                    desc: event.desc
                }
                db.collection('reservations').add(data).then(() => {
                    context.dispatch('getReservations').then(() => {
                        resolve()
                    }).catch((error) => {
                        reject(error)
                    })
                           
                }).catch((error) => {

                    reject(error)
                })
           
            })        
        },
        getReservations(context) {
            
            return new Promise((resolve, reject) => {
                if(context.state.user.clubs != null)
                {
                var activeClub = context.state.user.activeClubID
                context.state.events = []
                var events = []

                    db.collection("reservations").where("clubid", "==", activeClub)
                    .get()
                    .then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            const data = doc.data()
                            const newEvent = {
                                id: doc.id,
                                name: data.name,
                                boatid: data.boatid,
                                start: data.start,
                                end: data.end,
                                color: data.color,
                                timed: data.timed,
                                desc: data.desc,
                                clubid: data.clubid,
                            }

                            events.push(newEvent)
                            
                        });
                        context.commit('setEvents', events)
                    
                        resolve()
                    })
                    .catch((error) => {
                        reject()
                        console.log("Error getting documents: ", error);
                    });
                } else {
                    resolve()
                }
            }) 
        },
        deleteReservation(context, event) {
            return new Promise((resolve, reject) => {
                db.collection("reservations").doc(event.id).delete().then(() => {
                    context.dispatch('getReservations').then(() => {
                        resolve()
                    }).catch((error) => {
                        reject(error)
                    })
                }).catch((error) => {
                    reject(error)
                });
            })
        },
        joinClub() {

        },
        leaveClub() {

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