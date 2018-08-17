<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
  
export default {
  
  data() {
    return {
      
    }
  }
};

</script>
<style scoped lang="scss">
.admin_main {
  min-width: 1160px;
  background: #fff;
  padding: 0;
}
.el-header {
  min-width: 1360px;
  border-bottom: solid 1px #dce3e9;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 1;
}
.logo {
  line-height: 60px;
  font-size: 20px;
  color: #363d4d;
  img {
    height: 35px;
    width: auto;
    vertical-align: middle;
    margin-right: 5px;
  }
}
.btnwork {
  line-height: 60px;
  span {
    display: inline-block;
  }
  label {
    margin: 0 5px;
  }
  a {
    margin: 0 5px;
  }
  i {
    margin-right: 5px;
  }
}
</style>