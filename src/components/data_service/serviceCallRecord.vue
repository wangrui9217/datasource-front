<template>
  <div class="flex-box">
    <common-title title='服务调用日志查询'></common-title>
    <div class="g-listpage__style flex-inner">
      <div class="btn-group">
        <span>调用请求时间:</span>
        <el-date-picker
          v-model="time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期">
        </el-date-picker>
        <span>测试方式：</span>
        <el-select v-model="callSource" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input class="formula-form"  placeholder="请输入服务名称/服务编码/调用机构Key" v-model="queryName"></el-input>
        <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
      <el-table :data="tableData" border class="g-table">
        <el-table-column type="index" label="编号" :index="indexMethod">
        </el-table-column>
        <el-table-column  label="调用请求时间">
          <template slot-scope="scope">
            {{scope.row.requestTime|getTime}}
          </template>
        </el-table-column>
        <el-table-column  label="调用响应时间">
          <template slot-scope="scope">
            {{scope.row.responseTime|getTime}}
          </template>
        </el-table-column>
        <el-table-column prop="costTime" label="接口耗时">
        </el-table-column>
        <el-table-column prop="serviceName" label="服务名称">
        </el-table-column>
        <el-table-column prop="serviceCode" label="服务Code">
        </el-table-column>
        <el-table-column prop="tokenKey" label="调用机构key">
        </el-table-column>
        <el-table-column prop="addr" label="发起主机IP">
        </el-table-column>
        <el-table-column  label="调用方式">
          <template slot-scope="scope">
            {{scope.row.callSource|getCallSource}}
          </template>
        </el-table-column>
        <el-table-column  label="调用结果">
          <template slot-scope="scope">
            {{scope.row.status|getStatus}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <div class="actions">
              <a @click="viewDetail(scope.row)">查看明细</a>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        style="float:middle"
        @size-change="pageSizeChange"
        @current-change="pageNoChange"
        :current-page="pageNo"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="prev, pager, next, jumper,total, sizes"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { api } from '@/api'
  import { formatDate } from './../common/date'
  export default {
    data () {
      return {
        time: [],
        searchtime: '',
        callSource: '',
        searchcallSource: '',
        queryName: '',
        searchqueryName: '',
        pageSize: 10,
        pageNo: 1,
        total: null,
        options: [{
          label: '全部',
          value: ''
        }, {
          label: '接口调用',
          value: '1'
        }, {
          label: '页面来源',
          value: '0'
        }],
        value: '',
        value2: '',
        tableData: []
      }
    },
    watch: {
    },
    methods: {
      // 获取索引
      indexMethod (index) {
        return this.pageSize * (this.pageNo - 1) + index + 1
      },
      getLastMonth () {
        let end = new Date()
        let start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        this.time = [this.initDate(start), this.initDate(end)]
        this.searchtime = this.time
      },
      initDate (date) {
        return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
      },
      pageSizeChange (val) {
        this.pageSize = val
        this.initState()
      },
      pageNoChange (val) {
        this.pageNum = val
        this.initState()
      },
      // 搜索
      search () {
        this.searchtime = this.time
        this.searchcallSource = this.callSource
        this.searchqueryName = this.queryName
        this.initState()
      },
      // 初始化信息
      initState () {
        let params = {
          pageNum: this.pageNum,
          pageSize: this.pageSize,
          startRequestTime: this.searchtime[0],
          endRequestTime: this.searchtime[1],
          callSource: this.searchcallSource,
          queryName: this.searchqueryName
        }
        api.getServiceRedord(params).then(res => {
          this.tableData = res.data.pageInfo.list
          this.total = res.data.pageInfo.total
          console.log(res, 777)
        })
      },
      viewDetail (val) {
        console.log(val)
        this.$router.push({path: `serviceInvocation/${val.id}`})
      }
    },
    mounted () {
      this.getLastMonth()
      this.initState()
    },
    filters: {
      getTime (val) {
        let date = new Date(val)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      getCallSource (val) {
        return val === 0 ? '页面来源' : '接口调用'
      },
      getStatus (val) {
        return val === '0' ? '成功' : '失败'
      }
    }
  }
</script>
<style lang="scss" scoped>
  .btn-group{
    display: flex;
    justify-content: flex-end;
    align-items: center;
    /deep/ .el-date-editor .el-range-separator{
      width: 10%;
    }
    .el-select{
      width: 150px;
    }
    &>span{
      margin: 0 0 0 10px;
    }
    .el-input{
      width: 250px;
    }
    &>div, &>button{
      margin-left: 10px;
    }
  }
</style>
