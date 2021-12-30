<template>
  <div></div>
</template>

<script>
import firebase from "firebase/app"
export default {
    created() {
        
      firebase.auth().signOut().then(() => {
        this.$store.commit('setOverlay',false)
        this.$router.replace('/auth')
      })
        
      
    
    }
}
</script>

<style>

</style>