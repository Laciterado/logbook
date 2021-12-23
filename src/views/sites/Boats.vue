<template>

<div id="site" style="position:absolute; width:100%; height:100%;">
    
 

<div class="content">
        <v-dialog
          v-model="boatInfo"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              {{clickedBoat.name}}
            </v-card-title>
            <v-card-text>
                <div class="d-flex flex-column" v-if="clickedBoat.damaged">
                    <span class="overline error--text font-weight-bold">Achtung:</span>
                    <span class="overline error--text font-weight-normal">Ein Schaden liegt vor</span>
                    <span class="overline font-weight-light">Schadenbeschreibung:</span>
                    <span>{{clickedBoat.damage_desc}}</span>
                </div>
                <div class="d-flex flex-column mt-4" v-if="clickedBoat.onwater">
                    <span class="overline error--text">{{clickedBoat.name}} ist derzeit unterwegs</span>
                    <span>Dieses Boot ist derzeit reserviert oder befindet sich auf dem Wasser</span>
                </div>
                <div class="d-flex flex-column mt-4" v-if="clickedBoat.locked">
                    <span class="overline error--text">{{clickedBoat.name}} ist derzeit gesperrt!</span>
                    <span>Dieses Boot ist derzeit nicht verfügbar</span>
                </div>
                <div class="d-flex flex-column mt-4" v-if="!clickedBoat.damaged && !clickedBoat.locked">
                    <span class="overline success--text">Boot ist fahrbereit<v-icon class="pl-4 success--text" left small>done</v-icon></span>
                </div>
                <div class="d-flex flex-column mt-4" v-if="!clickedBoat.onwater && !clickedBoat.locked">
                    <span class="overline success--text">Boot ist verfügbar<v-icon class="pl-4 success--text" left small>done</v-icon></span>
                </div>


            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                text
                @click="boatInfo = false"
              >
                Schließen
              </v-btn>
              <v-btn
                color="success"
                text
                @click="boatDialog=true; boatInfo=false"
              >
                Weiter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>


        <v-dialog
          v-model="boatDialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title class="mb-4">
              {{clickedBoat.name}}
            </v-card-title>
            <v-card-text>
              <v-select
                :items="select"
                label="Optionen auswählen"
                item-text="text"
                item-value="id"
                v-model="selectedOption"
              ></v-select>
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="primary"
                text
                @click="boatDialog = false"
              >
                Schließen
              </v-btn>
              <v-btn
                color="success"
                text
                @click="nextDialog()"
              >
                Weiter
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-dialog
          v-model="deleteBoatDialog"
          max-width="500px"
        >
          <v-card>
            <v-card-title>
              {{clickedBoat.name}}
            </v-card-title>
            <v-card-text>
                Möchtest du das Boot wirklich löschen?
            </v-card-text>
            <v-card-actions>
              <v-btn
                color="error"
                text
                @click="deleteBoatDialog = false"
              >
                Abbrechen
              </v-btn>
              <v-btn
                color="success"
                text
                @click="deleteBoat()"
              >
                Löschen
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>



  <v-card tile style="background:transparent;" class="pa-0 ma-0" flat>
      
    <v-card-title style="min-height:5%; width:100%" class="pa-0 px-4 pb-4 pt-2 ma-0">
      


    </v-card-title>

    <div class="d-none d-sm-block">
    <v-flex class="px-8 pb-4 pb-sm-0 d-flex justify-start text-uppercase text-caption text--secondary">
        <span class="td">Boot</span>
        <span class="td">Schaden</span>
        <span class="td">Verfügbar</span>
    </v-flex>
    </div>

    <v-data-table
        class="pa-sm-4 ma-0 pb-16 mx-sm-0 mx-4"
        style=" height:95%; min-height:95%; width:auto; overflow-y: auto; background:transparent;"
        :headers="headers"
        :items="boats"
        :search="getBoatSearchInput"
        :hide-default-footer="true"
        :hide-default-header="true"
        :items-per-page="-1"
        :group-by="grouped"


        
    >

    <template v-slot:group.header="{ headers, group, items, isOpen, toggle}">
     
            <td :colspan="headers.length" v-if='group' style="border-bottom:solid 4px #121212; width:100vw; margin:0; padding:0; overflow:hidden;" >
            
            <v-btn
            tile
            elevation="0"
            block
            style='height:100%; display:flex; justify-content:flex-start;'
            @click="toggle" :ref="group" :data-open="isOpen" :data-name='group' 
            >
                <!-- v-on:click="toggleAll(group)" -->


                
                <div style="width:20%" class="d-flex justify-start">
                <v-icon left>
                    {{ isOpen ? 'mdi-chevron-down' : 'mdi-chevron-right' }}
                </v-icon>
                <span  >{{ items[0].class }}</span>
                </div>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='1X'" >
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='2X'" >
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='2X+'" >
                    <v-icon left color="grey">airline_seat_recline_normal</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='2+'" >
                    <v-icon left color="grey">airline_seat_recline_normal</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='2-'" >
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='3X+'" >
                    <v-icon left color="grey">airline_seat_recline_normal</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='3X'" >
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='4X'" >
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='4X+'" >
                    <v-icon left color="grey">airline_seat_recline_normal</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='4+'" >
                    <v-icon left color="grey">airline_seat_recline_normal</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='4-'" >
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='5X+'" >
                    <v-icon left color="grey">airline_seat_recline_normal</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='6X+'" >
                    <v-icon left color="grey">airline_seat_recline_normal</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='8X+'" >
                    <v-icon left color="grey">airline_seat_recline_normal</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='8+'" >
                    <v-icon left color="grey">airline_seat_recline_normal</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                    <v-icon left>rowing</v-icon>
                </v-flex>


            </v-btn>
        
            </td>


    </template>
    
    <template v-slot:item="{ item }">
        <tr style="width:100%; display:flex; overflow:hidden; max-width:100%;" @click="boatOptions(item)">
            <td class="td text-uppercase">{{item.name}}</td>
            <td class="td">
                <v-icon left v-if="!item.damaged">remove</v-icon>
                <v-icon left v-if="item.damaged" color="warning">warning_amber</v-icon>
            </td>
            <td class="td">
                <v-icon left v-if="!item.onwater && !item.locked" color="success">done</v-icon>
                <v-icon left v-if="item.onwater">warning_amber</v-icon>
                <v-icon left v-if="item.locked" color="error">close</v-icon>
            </td>
        </tr>
    </template>




  
    </v-data-table>


    </v-card>

    
</div>
</div>
</template>

<script>
import { mapGetters } from "vuex";

export default {

    

    data() {
        return {
            search: '',
            boatsChanged: 0,
            //closed: false,
            boatDialog: false,
            boatInfo: false,
            deleteBoatDialog: false,
            clickedBoat: [],
            selectedOption: '',
            headers: [
                { text: 'Bootsname', align: 'start', value: 'name',},
                { text: 'Bootsklasse', value: 'class', },
                { text: 'Schaden', value: 'damaged' },
                { text: 'Reserviert', value: 'reserved' },
            ],
            select: [
                { text: 'Fahrt beginnen', id: '0' },
                { text: 'Schaden melden', id: '1' },
                { text: 'Boot reservieren', id: '2' },
                { text: 'Boot sperren | entsperren', id: '3' },
                { text: 'Boot entfernen', id: '4' },
                
            ]
  
     
            
        }
    },
    computed: {
        ...mapGetters(['getBoatSearchInput']),
        ...mapGetters({boats: 'getBoats'}),
        grouped() {
            if(this.$store.state.searchBoatInput.input === '') {
                
                return 'class';
            }
            else return '';
        }
    },
    methods: {
        // toggleAll(groupName) {
        //     if(this.closed) {
            
        //         Object.keys(this.$refs).forEach(k => {
        //             if (this.$refs[k] && this.$refs[k].$attrs['data-open'] && this.$refs[k].$attrs['data-name'] != groupName) {
        //                 this.$refs[k].$el.click()
        //             }
        //         })
        //     }

        // },
        closeAll () {
            //if(!this.closed) {
        
                Object.keys(this.$refs).forEach(k => {
            
                    if (this.$refs[k] && this.$refs[k].$attrs['data-open']) {
                        this.$refs[k].$el.click()
                        
                        
                    }
                })
      
         
            //}
            
        },
        boatOptions(boat) {
            this.selectedOption = null
            this.clickedBoat = boat
            this.boatInfo= true
        },
        nextDialog() {
            this.boatDialog = false
            
            if(this.selectedOption == 4) //ID aus der Selectauswahl für -> Boot löschen 
            {
                this.selectedOption = null
                this.deleteBoatDialog = true
            }
            else if(this.selectedOption == 1) //ID aus der Selectauswahl für -> Bootsschaden melden
            {
                this.selectedOption = null
                this.$router.replace('/damage/'+ this.clickedBoat.id +'')
            }
            else if(this.selectedOption == 2) {
                this.selectedOption = null
                this.$router.replace('/addreservation/'+ this.clickedBoat.id +'')
            }
            else if(this.selectedOption == 3) 
            {
                this.selectedOption = null
                this.lockBoat()
            }
            else
            {
                this.selectedOption = null
            }
        },
        deleteBoat() {
            this.deleteBoatDialog = false
            this.$store.dispatch('deleteBoat',this.clickedBoat).then(() => {
                this.$store.dispatch('updateSnackbar', {text: 'Boot wurde gelöscht!', state: 'true', color: 'success'})
            }).catch((error) => {
                this.$store.dispatch('updateSnackbar', {text: error, state: 'true', color: 'error'})
            })

        },
        lockBoat() {
          this.$store.dispatch('lockBoat',this.clickedBoat).then(() => {
                if(this.clickedBoat.locked == true) {
                  this.$store.dispatch('updateSnackbar', {text: 'Boot wurde entsperrt!', state: 'true', color: 'success'})
                }
                else {
                  this.$store.dispatch('updateSnackbar', {text: 'Boot wurde gesperrt!', state: 'true', color: 'success'})
                }
                

            }).catch((error) => {
                this.$store.dispatch('updateSnackbar', {text: error, state: 'true', color: 'error'})
            })
        }



    },
    updated: function() {
 
        if(this.boatsChanged != this.boats.length) {
            this.boatsChanged = this.boats.length
            this.closeAll();
        }
    },        
    mounted: function() {
       this.boatsChanged = this.boats.length
       this.closeAll();
 
    },



}
</script>

<style>


.td {
    min-width: 20%;
    max-width: 20%;
    overflow: hidden;
    display: inline-block;
    white-space: nowrap;
    display:flex;
    justify-content: flex-end;
    align-items: center;
}
.td:first-child {
    min-width: 60%;
    max-width: 60%;
    justify-content: flex-start;
}
</style>