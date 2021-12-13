<template>
  <div id="site">


    <v-snackbar absolute v-model="snackbar.state" :timeout="1500" top :color='snackbar.color'>
          <span>{{snackbar.text}}</span>
    </v-snackbar>

    <!---
    <div class="pl-4 pt-sm-8 pb-sm-8 d-flex" :class="{'hide_mobile pa-0 ma-0 d-none': $vuetify.breakpoint.smAndDown}">
      <h3 class="d-none d-sm-block text-uppercase font-weight-light">
        TITEL
      </h3>
    </div>
    --->


  

      
      <div>    

        <span>Top</span>
        <div style="width:400px; max-width:100%; height:2000px; background:red;"></div>
        <span>End</span>

      </div>


   



  </div>
</template>

<script>
export default {

data: () => ({

    snackbar:[],
}),
methods: {
  back() {
      this.$router.go(-1)
    },
}
}
</script>

<style>

</style>