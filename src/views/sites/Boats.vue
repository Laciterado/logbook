<template>

<v-layout wrap>
       

<v-flex >

  <v-card tile style="background:transparent;" class="pa-0 ma-0" flat>
      
    <v-card-title style="min-height:5%; width:100%" class="pa-0 px-4 pb-4 pt-2 ma-0">
      


    </v-card-title>

    <div class="d-none d-sm-block">
    <v-flex class="px-8 pb-4 pb-sm-0 d-flex justify-start text-uppercase text-caption text--secondary">
        <span class="td">Boot</span>
        <span class="td">Schaden</span>
        <span class="td">Unterwegs</span>
    </v-flex>
    </div>

    <v-data-table
        class="pa-sm-4 ma-0 pb-16 mx-sm-0 mx-2"
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

                <v-flex class="pl-4 d-flex justify-start" v-if="group==='2-'" >
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
        <tr style="width:100%; display:flex; overflow:hidden; max-width:100%;">
            <td class="td text-uppercase">{{item.name}}</td>
            <td class="td">
                <v-icon left v-if="!item.damaged">remove</v-icon>
                <v-icon left v-if="item.damaged">warning_amber</v-icon>
            </td>
            <td class="td">
                <v-icon left v-if="!item.onwater">remove</v-icon>
                <v-icon left v-if="item.onwater">done</v-icon>
            </td>
        </tr>
    </template>




  
    </v-data-table>


    </v-card>

    
    </v-flex>


    </v-layout>

</template>

<script>
import { mapGetters } from "vuex";

export default {

    

    data() {
        return {
            search: '',
            //closed: false,
    
            headers: [
                { text: 'Bootsname', align: 'start', value: 'name',},
                { text: 'Bootsklasse', value: 'class', },
                { text: 'Schaden', value: 'damaged' },
                { text: 'Reserviert', value: 'reserved' },
            ],
  
     
            
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



    },
    updated: function() {
        
        this.closeAll();
    
    },        
    mounted: function() {

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