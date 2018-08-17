<template>
 <div>
  <!-- <mu-circular-progress :size="40" v-if="loading"/> -->
  <!-- <div v-html="html"></div> -->
  <iframe src="http://192.168.22.122:8086/dsIntegration-manager/druid/sql.html" width="100%" height="800"></iframe>
 </div>
</template>
<style>
 
</style>
<script>
import axios from 'axios'
 export default{
  data () {
   return {
    loading: false,
    html: ''
   }
  },
  mounted () {
  },
  methods: {

  }
 }
</script>
<style lang="scss" scoped>
.formula-form {
  width: 200px;
  margin-right: 20px;
}
.actions {
  color: #0000ff;
  button {
    color: #0000ff;
    border: none;
    background: none;
    cursor: pointer;
    outline: none;
    &[disabled] {
      cursor: no-drop;
      color: #999;
    }
  }
}
</style>