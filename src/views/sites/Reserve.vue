<template>
<div id="site" style="position:absolute; width:100%; height:100%;">
    
  <div style="position:fixed; z-index:2; height:64px; width:100%; padding: 0 16px 16px 16px; margin-right:16px;">
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
 <div class="content" style="padding-top:64px; padding-bottom:16px; overflow-y:scroll">
     
    <v-sheet class="pl-4" style="background:transparent;">
      <v-calendar
        style="border: 0; border-radius:5px; margin-top:16px;"
        ref="calendar"
        v-model="focus"
        color="primary"
        :events="events"
        locale="de"
        event-color="color"
        :type="type"
        @change="updateRange"
      ></v-calendar>
    </v-sheet>
 
  </div>
</div>
</template>

<script>
export default {

data: () => ({
    focus: '',
    type: 'day',
    // events: [
    //   {name: 'Test', start: 1640115356464, end: 1640208992000, color: 'blue', timed: true},
    //   {name: 'Test', start: 1640115356464, end: 1640208992000, color: 'green', timed: true},
    //   {name: 'Test', start: 1640115356464, end: 1640208992000, color: 'red', timed: true},
    //   {name: 'Test', start: 1640115356464, end: 1640208992000, color: 'indigo', timed: true},

    // ],
    events: [],
    colors: ['blue', 'indigo', 'deep-purple', 'cyan', 'green', 'orange', 'grey darken-1'],
    names: ['Meeting', 'Holiday', 'PTO', 'Travel', 'Event', 'Birthday', 'Conference', 'Party'],
  }),
  updated () {
 
  },
  mounted () {
    const second = new Date().getTime()
    console.log(second)
    this.$refs.calendar.checkChange()
  },
  methods: {
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
    updateRange ({ start, end }) {
      const events = []

      const min = new Date(`${start.date}T00:00:00`)
      const max = new Date(`${end.date}T23:59:59`)
      const days = (max.getTime() - min.getTime()) / 86400000
      const eventCount = this.rnd(days, days + 20)

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0
        const firstTimestamp = this.rnd(min.getTime(), max.getTime())
        const first = new Date(firstTimestamp - (firstTimestamp % 900000))
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000
        const second = new Date(first.getTime() + secondTimestamp)

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: first,
          end: second,
          color: this.colors[this.rnd(0, this.colors.length - 1)],
          timed: !allDay,
        })
      }

      this.events = events
    },
    rnd (a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a
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
  padding-right:16px;
}
.v-calendar-daily__head {

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