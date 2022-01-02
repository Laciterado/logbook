<template>
<div id="site" style="position:absolute; width:100%; height:100%;">
    <div class="content px-4 px-sm-0 d-flex justify-center align-center" v-if="user.clubs == null">
      <v-card max-width="750" class="pa-sm-4 pa-0" :class="{'transparent': $vuetify.breakpoint.smAndDown}" elevation="0">
      <v-card-title class="pa-0 ma-0 overline success--text mb-4">
          <v-icon class="mr-4 success--text">home</v-icon>
          Vereine
      </v-card-title>
      <v-card-text class="pa-0 py-4 d-flex flex-column">
        <span class="overline primary--text font-weight-light">Trete einem Verein bei <v-icon class="px-2" small>group_add</v-icon><br>oder erstelle deinen eigenen ersten Verein! <v-icon small class="px-2">add_business</v-icon></span>
      </v-card-text>
    </v-card>
    </div>

    <div class="content" v-if="user.clubs != null">


        <div style="height:100%; display:flex; justify-content:center; align-items:center;" :class="{'align-start': $vuetify.breakpoint.smAndDown}" v-if="user.clubs != null">
        <v-card style="max-width:700px; width:100%" elevation="0" class="pa-0 ma-0 pa-4" :class="{'transparent': $vuetify.breakpoint.smAndDown}">
            <v-card-title class="overline py-4 success--text">{{ activeClub.name }}</v-card-title>
            <v-card-text class="py-4">
                <div class="d-flex align-center mb-10">
                <v-chip
                    class="px-4 caption"
                    color="success"
                    label
                    text-color="#363636"
                >
                    <v-icon left>
                    tag
                    </v-icon>
                    {{ user.activeClubID }}
                </v-chip>
                <v-btn icon @click="copieID()" class="ml-4"><v-icon class="grey--text">content_copy</v-icon></v-btn>
                </div>
                <span class="font-weight-light text-uppercase caption">Aktuelle Zahlen</span>
                <div class="mt-4">
                    <v-simple-table dark>
                    <template v-slot:default>
                        <thead>
                        <tr>
                            <th class="text-left caption font-weight-bold">
                            Kategorie
                            </th>
                            <th class="text-left caption font-weight-bold">
                            Anzahl
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr
                            v-for="item in fakts"
                            :key="item.name"
                        >
                            <td class="caption font-weight-light">{{ item.name }}</td>
                            <td class="caption font-weight-light">{{ item.count }}</td>
                        </tr>
                        </tbody>
                    </template>
                    </v-simple-table>
                </div>
            </v-card-text>
        </v-card>
        </div>
    </div>
</div>      
</template>

<script>

import { mapGetters } from "vuex";

export default {
    data: () => ({

    }),
  computed: {
    ...mapGetters({user: 'getUser'}),
    ...mapGetters({activeClub: 'getActiveClub'}),
    ...mapGetters({fakts: 'getFakts'}),
  },
  methods: {
      copieID() {
        navigator.clipboard.writeText(this.user.activeClubID)
        this.$store.dispatch('updateSnackbar', {text: 'Vereins-ID kopiert', state: 'true', color: 'success'})
      }
  },
  updated() {

  },
  mounted() {
 
  }    
}
</script>

<style>

</style>