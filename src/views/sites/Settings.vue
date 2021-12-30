<template>

  <div id="site" style="position:absolute; width:100%; height:100%;">

    <div class="content px-4">


      <v-btn class="mt-4" @click="action()">Verein lesen</v-btn>

   

    </div>

  </div>
</template>

<script>
export default {
  data: () => ({

  }),
  methods: {
    action() {
      this.$store.dispatch('setActiveClub', '5cpSpZ3uultHu7ivb55d')
    }
    
    },
    
    mounted: function() {
      
    }
}
</script>

<style>

</style>