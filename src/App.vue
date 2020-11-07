<template>
  <div id="app">
    <router-view/>
  </div>
</template>
<script>
  import{resetRem} from "./utils/resetRem";

  export default{
    mounted() {
      resetRem()
      window.onresize = resetRem
    }
  }
</script>

<style lang="scss" >


</style>
