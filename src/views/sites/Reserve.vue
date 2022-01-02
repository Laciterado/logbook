<template>
<div id="site" style="position:absolute; width:100%; height:100%;">
  <div class="content px-4 px-sm-0 d-flex justify-center align-center" v-if="boats.length < 1">
    <v-card max-width="750" class="pa-sm-4 pa-0" elevation="0" :class="{'transparent': $vuetify.breakpoint.smAndDown}">
        <v-card-title class="pa-0 ma-0 overline success--text mb-4">
            <v-icon class="mr-4 success--text d-sm-block d-none">report_problem</v-icon>
            Keine Boot vorhanden
        </v-card-title>
        <v-card-text class="pa-0 py-4 d-flex flex-column">
            <span class="caption text-uppercase primary--text font-weight-light mb-4">Dieser Verein besitzt aktuell keine Boote</span>
            <span class="caption text-uppercase">Um diese Funktion nutzen zu können, musst du zuerst ein neues Boot erstellen.</span>
        </v-card-text>
        <v-card-actions class="pa-0 ma-0 mt-4">
            <v-spacer class="d-sm-block d-none"></v-spacer>
            <v-btn small color="success" class="darkbg--text" :to="'/addboat'">Boot hinzufügen</v-btn>
            
        </v-card-actions>
      </v-card>
  </div> 

  <div style="position:fixed; z-index:2; height:64px; width:100%; padding: 0 16px 16px 16px; margin-right:16px;" v-if="user.clubs != null && boats.length > 0">
    <div style="display:flex; align-items:center; background:#121212; padding-top:16px; padding-bottom:16px;">
      <v-btn
        outlined
        class="mr-4 overline"
        color="primary"
        @click="setToday"
        text
      >
        Heute
      </v-btn>
      <v-btn
        fab
        text
        small
        color="primary"
        @click="prev"
      >
        <v-icon small>
          mdi-chevron-left
        </v-icon>
      </v-btn>
      <v-btn
        fab
        text
        small
        color="primary"
        @calendarNext="next()"
        @click="next"
      >
        <v-icon small>
          mdi-chevron-right
        </v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-title v-if="$refs.calendar" class="overline">
        {{ this.$refs.calendar.$data.lastStart.day + '. ' + $refs.calendar.title }}
      </v-toolbar-title>
    </div>
 </div>
 <div class="content" style="padding:0; padding-top:64px; padding-bottom:16px; overflow-y:scroll" v-if="user.clubs != null && boats.length > 0">
     
    <v-sheet class="pa-0" style="background:transparent; width:100%;">
      <v-calendar
        style="border: 0; border-radius:5px; margin-top:16px;"
        ref="calendar"
        v-model="focus"
        color="primary"
        :events="events"
        locale="de"
        event-color="color"
        :type="type"
        @click:event="showEvent"
 
      ></v-calendar>
      <v-menu
        v-model="selectedOpen"
        :close-on-content-click="false"
        :activator="selectedElement"
        offset-x
      >
        <v-card
          color="grey lighten-4"
          min-width="350px"
          max-width="500px"
          flat
        >
          <v-toolbar
            :color="selectedEvent.color"
            dark
          >
            <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="deleteDialog(selectedEvent)"> 
              <v-icon>delete</v-icon>
            </v-btn>
          </v-toolbar>
          <v-card-text class="secondary--text d-flex flex-column">
            <div>
              <span class="overline font-weight-bold">Beginn: </span>
              <span class="overline">{{ formatDate(selectedEvent.start) }} Uhr</span>
            </div>
            <div>
              <span class="overline font-weight-bold mr-4">Ende: </span>
              <span class="overline">{{ formatDate(selectedEvent.end) }} Uhr</span>
            </div>
            <div style="width:100%; height:1px;" class="grey my-2"></div>
            <span class="overline font-weight-bold">Beschreibung:</span>
            <span>{{ selectedEvent.desc }}</span>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              color="secondary"
              @click="selectedOpen = false"
            >
              Schließen
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-menu>
    </v-sheet>
 
    <v-dialog
        v-model="delete_dialog"
        persistent
        max-width="290"
      >
        <v-card>
          <v-card-title>
            Reservierung löschen
          </v-card-title>
          <v-card-text>
            Möchtest du diese Reservierung wirklich löschen?  
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="error"
              text
              @click="deleteEvent()"
            >
              Löschen
            </v-btn>
            <v-btn
              color="secondary"
              text
              @click="delete_dialog = false"
            >
              Abbruch
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>



  </div>
</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {

data: () => ({
    focus: '',
    type: 'day',
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    delete_dialog: false,
    choosedEvent: null,
  }),
  updated () {
 
  },
  mounted () {

    if(this.user.clubs != null && this.boats.length > 0) {
      this.focus = this.$refs.calendar.$data.lastStart.date
    } 
    

  },
  computed: {
      ...mapGetters({events: 'getEvents'}),
      ...mapGetters({user: 'getUser'}),
      ...mapGetters({boats: 'getBoats'}),
  },
  methods: {
    deleteDialog(event) {
      this.choosedEvent = event
      this.selectedOpen = false
      this.delete_dialog = true

    },
    deleteEvent() {
      this.delete_dialog = false
      this.$store.dispatch('deleteReservation', this.choosedEvent).then(() => {
        this.$store.dispatch('updateSnackbar', {text: 'Reservierung gelöscht!', state: 'true', color: 'success'})
        this.choosedEvent = null
      }).catch((error) => {
        this.$store.dispatch('updateSnackbar', {text: 'Es ist ein Fehler aufgetreten', state: 'true', color: 'error'})
        this.choosedEvent = null
        console.log(error)
      })
    },
    getEventColor (event) {
      return event.color
    },
    setToday () {
      this.focus = ''
    },
    prev () {
      this.$refs.calendar.prev()
    },
    next () {
      this.$refs.calendar.next()
    },
    showEvent ({ nativeEvent, event }) {
      const open = () => {
        this.selectedEvent = event
        this.selectedElement = nativeEvent.target
        requestAnimationFrame(() => requestAnimationFrame(() => this.selectedOpen = true))
      }

      if (this.selectedOpen) {
        this.selectedOpen = false
        requestAnimationFrame(() => requestAnimationFrame(() => open()))
      } else {
        open()
      }

      nativeEvent.stopPropagation()
    },
    formatDate(date) {
      const formateddate = new Date(date).toLocaleString("de-DE", {year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit'})
      return formateddate
    },
   
  },





}
</script>

<style>
.v-calendar-events .v-event-timed {
    border: 0 !important;

}
.theme--dark.v-calendar-events .v-event-timed {
  border: 0 !important;
}

.v-calendar-daily .v-calendar-daily_head-day {
  border:0 !important;
}
.v-calendar-daily .v-calendar-daily__intervals-head {
  display:none !important;
  border:0 !important;
}
.v-calendar-daily__intervals-head::after {
  display:none !important;
}
.v-calendar-daily .v-calendar-daily__day {
  border: 0 !important;
}
.v-calendar-daily .v-calendar-daily__intervals-body {
  border: 0 !important;
}
.v-calendar-daily_head-day-label .v-btn.v-btn--has-bg {
  background:rgb(39, 39, 39) !important;
}
.v-calendar {
  background:transparent !important;
}

.v-calendar-daily {
  background:transparent !important;
}
.v-calendar-daily__body {
  background:transparent !important;
  border-radius: 5px;
  padding-right:4px;
}
.v-calendar-daily__head {

  display:none;

  margin: 0 !important;
  margin-bottom: 16px !important;
  background:transparent !important;
  border-radius: 5px;
  padding:16px 0 16px 16px;
  overflow: hidden;
}
.v-calendar-daily__scroll-area {
  overflow: hidden;
}
.v-calendar-daily_head-day-label {
  display: none;
}
.v-calendar-daily_head-weekday {
  display:none;
}
.v-calendar-daily__interval-text {
  color: #06d6a0 !important;
}

  * {
    scrollbar-width: auto;
    scrollbar-color: #424242 #3d3d3d;
  }

  /* Chrome, Edge, and Safari */
  *::-webkit-scrollbar {
    width: 16px;
  }

  *::-webkit-scrollbar-track {
    background: #121212;
  }

  *::-webkit-scrollbar-thumb {
    background-color: #424242;
    border-radius: 10px;
    border: 6px solid #121212;
  }

</style>