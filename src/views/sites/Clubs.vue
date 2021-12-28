<template>
<div id="site" style="position:absolute; width:100%; height:100%;">
    <div class="content">
        <div style="height:100%; display:flex; justify-content:center; align-items:center;" :class="{'align-start': $vuetify.breakpoint.smAndDown}">
        <v-card style="max-width:700px; width:100%" elevation="0" class="pa-0 ma-0 pa-4" :class="{'transparent': $vuetify.breakpoint.smAndDown}">
            <v-card-title class="overline py-4 success--text">{{ user.activeClub.name }}</v-card-title>
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
                    {{ user.activeClub.id }}
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
    ...mapGetters({fakts: 'getFakts'}),
  },
  methods: {
      copieID() {
        navigator.clipboard.writeText(this.user.activeClub.id)
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