<template>
  <div class="title" :class="{'mb':hasBottom}">
    <p>{{title}}</p>
  </div>
</template>

<script>
  export default {
    name: 'commonTitle',
    data () {
      return {
      }
    },
    methods: {
    },
    props: {
      title: {
        default: '标题',
        type: String
      },
      hasBottom: {
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
.title{
  color: #169BD5;
  background-color: #f0f2f5;
  font-size: 20px;
  padding: 25px 0 10px 40px;
}
  .mb{
    margin-bottom: -30px;
  }
</style>
