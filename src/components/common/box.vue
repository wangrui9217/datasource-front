<template>
  <el-row class="box" v-loading="isLoading">
    <template v-for="(item ,index) in data">
      <el-col :key="index" class="inner" :span="item.span||6">
        <label class="label">{{item.label}}:</label>
        <div class="value">{{item.value}}</div>
      </el-col>
    </template>
  </el-row>
</template>

<script>
  export default {
    name: 'commonBox',
    data () {
      return {
      }
    },
    methods: {
    },
    props: {
      data: {
        default: [{label: '标题', value: '内容'}],
        type: Array
      },
      isLoading: {
        default: false,
        type: Boolean
      }
    },
    mounted () {},
    components: {},
    filters: {},
    computed: {},
    watch: {}
  }
</script>

<style lang="scss" scoped>
  .box{
    color: #606266;
    padding: 20px 20px 0 20px;
    display: flex;
    flex-wrap: wrap;
    .inner{
      display: flex;
      margin-bottom: 20px;
      padding-right: 20px;
      .label{
        text-align: right;
        width: 100px;
        padding-right: 12px;
      }
      .value{
        flex: 1;
        word-break: break-word;
      }
    }
  }
</style>
