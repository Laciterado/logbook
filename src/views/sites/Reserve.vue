<template>
  <div id="site" style="position:absolute; width:100%; height:100%;">
    
    <div class="submenu px-4">
      <span>Test</span>
    </div>

    <div class="content px-4">
      <span>Top</span>
      <div style="background:blue; width:100%; height:2000px;">
      </div>    
      <span>Bottom</span> 
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