<template>

  <div id="site" style="position:absolute; width:100%; height:100%;">

    <div class="content px-4">


      <v-btn class="mt-4 error" @click="action()">Abmelden</v-btn>

   

    </div>

  </div>
</template>

<script>
export default {
  data: () => ({

  }),
  methods: {
    action() {
      this.$router.push('/logout')
    }
    
    },
    
    mounted: function() {
      
    }
}
</script>

<style>

</style>