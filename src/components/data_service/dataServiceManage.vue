<template>
  <div class="flex-box">
    <el-dialog
      title="测试数据"
      :visible.sync="serviceTestVisible"
      width="900px"
      :before-close="handleCloseServiceTest">
      <template>
        <el-form :model="ruleForm"  ref="ruleForm" v-show="testStep === 1">
          <el-table :data="ruleForm.tableData" border class="slot-table">
            <el-table-column prop="fieldName" label="接口入参名称">
            </el-table-column>
            <el-table-column prop="fieldCode" label="接口入参Code">
            </el-table-column>
            <el-table-column  label="参数类型">
              <template slot-scope="scope">
                {{scope.row.dataType|getDataType}}
              </template>
            </el-table-column>
            <el-table-column  label="必填">
              <template slot-scope="scope">
                <div class="actions">
                  <el-checkbox  disabled v-if="scope.row.required === 'Y'" :checked ="true"></el-checkbox>
                  <el-checkbox  disabled v-else :checked ="false"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="接口输入值" >
              <template slot-scope="scope">
                <div class="actions">
                  <template v-if="scope.row.fieldCode === 'tokenKey' || scope.row.fieldCode === 'serviceCode'">
                    <el-form-item >
                      <el-input v-model.trim="scope.row.input" placeholder="请输入内容" disabled></el-input>
                    </el-form-item>
                  </template>
                  <template v-else>
                    <el-form-item  :prop="'tableData.' + scope.$index + '.input'"   :rules="{required: true, message: '此项不能为空', trigger: 'blur'}" v-if="scope.row.required === 'Y'">
                      <el-input v-model.trim="scope.row.input" placeholder="请输入内容"></el-input>
                    </el-form-item>
                    <el-form-item  v-else>
                      <el-input v-model.trim="scope.row.input" placeholder="请输入内容"></el-input>
                    </el-form-item>
                  </template>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
        <span slot="footer" class="dialog-footer" v-show="testStep === 1">
          <el-button @click="handleCloseServiceTest">取 消</el-button>
          <el-button type="primary" @click="goNext" :loading="isTesting">测 试</el-button>
        </span>
      </template>
      <template>
        <div class="box-contain" v-show="testStep === 2">
          <div class="row">
            <div>测试结果:</div>
            <div class="result">{{result.message}}</div>
          </div>
          <div class="row">
            <div>测试结果:</div>
            <div>
              <div class="result-contain">
                {{result}}
              </div>
              <a class="common-href"
                 v-clipboard:copy="resultString"
                 v-clipboard:success="onCopy"
                 v-clipboard:error="onError">复制结果</a>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer" v-show="testStep === 2">
          <el-button @click="goPrevious">重新测试</el-button>
          <el-button type="primary" @click="handleCloseServiceTest">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog
      title="服务类型选择"
      :visible="dialogVisible"
      width="400px"
      :before-close="handleClose">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText2">
      </el-input>
      <el-tree
        class="filter-tree"
        node-key="id"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="nodeClick2"
        :filter-node-method="filterNode2"
        ref="tree2">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="moveDataTo" :disabled="selectedNode? false: true">确 定</el-button>
      </span>
    </el-dialog>
    <common-title title='基础服务管理'></common-title>
    <div class="grow">
      <common-tree @nodeChange="nodeChange" :type="3"></common-tree>
      <div class="right">
        <div class="right-inner">
          <div class="btn-group">
            <span>
            <el-button type="primary"  icon="el-icon-plus" @click="addService">新增服务</el-button>
            <el-button   icon="fa fa-arrows-alt" @click="moveData" :disabled="selectValue.length == 0">移动</el-button>
            <el-button    @click="deleteService" :disabled="selectValue.length == 0">
              <i class="iconfont-remove-color" ></i>
              <span>删除</span>
            </el-button>
            <el-button   @click="changeService(0)" :disabled="selectValue.length == 0">
              <i class="iconfont-stop-color" ></i>
              <span>停用</span>
            </el-button>
            <el-button    @click="changeService(1)" :disabled="selectValue.length == 0">
              <i class="iconfont-start-color" ></i>
               <span>启用</span>
            </el-button>
            </span>
            <span>
              <el-select v-model="value" placeholder="请选择请求方式">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input class="formula-form"  placeholder="请输入服务名称/服务代码" v-model="queryName"></el-input>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </span>
          </div>
          <el-table :data="tableData" border class="g-table"
                    row-key="serviceId" ref="table"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" :reserve-selection="true">
            </el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="serviceCode" label="服务Code">
            </el-table-column>
            <el-table-column prop="serviceName" label="服务名称">
            </el-table-column>
            <el-table-column  label="启用状态">
              <template slot-scope="scope">
                {{scope.row.status|getStatus}}
              </template>
            </el-table-column>
            <el-table-column prop="updateName" label="更新人">
            </el-table-column>
            <el-table-column  label="更新时间" >
              <template slot-scope="scope">
               {{scope.row.updateTime|getTime}}
              </template>
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <div class="actions">
                  <a @click="editOrgInfo(scope.row)">编辑</a>
                  <a @click="serviceTest(scope.row)">服务测试</a>
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
    </div>
  </div>
</template>

<script>
  import { api } from '@/api'
  import { formatDate } from './../common/date'
  import arrayToTree from "array-to-tree";
  export default {

    data () {
      return {
        isTesting: false,
        total: null,
        selectValue: '',
        pageNo: 1,
        pageSize: 10,
        value: '',
        queryName: '',
        categoryId: '',
        selectvalue: '',
        selectqueryName: '',
        treeData: [],
        result: {},
        resultString: '',
        node: '',
        menuVisible: false,
        serviceTestVisible: false,
        selectedNode: '',
        id: 88,
        tableData: [],
        tableData2: [],
        tokenKey: '',
        dialogVisible: false,
        testStep: 1,
        options: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '单次请求'
        }, {
          value: '2',
          label: '多次请求'
        }],
        filterText: '',
        filterText2: '',
        defaultProps: {
          children: 'children',
          label: 'name'
        }
      }
    },
    watch: {
      filterText2 (val) {
        this.$refs.tree2.filter(val)
      }
    },

    methods: {
      // 查找
      search () {
        this.selectvalue = this.value
        this.selectqueryName = this.queryName
        this.getDataServiceList()
      },
      // 修改表单状态
      changeService (val) {
        let temp = []
        this.selectValue.map(val => {
          temp.push(val.serviceId)
        })
        let params = {
          status: val,
          serviceIds: temp.join()
        }
        api.updateDataServiceState(params).then(res => {
          this.$message.success('修改成功')
          this.getDataServiceList()
        })
      },
      // 删除选中表单
      deleteService (val) {
        this.$confirm('此操作将删除该条数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let temp = []
          this.selectValue.map(val => {
            temp.push(val.serviceId)
          })
          let params = {
            serviceIds: temp.join()
          }
          api.deleteDataServiceList(params).then(res => {
            this.$message.success('删除成功')
            this.getDataServiceList()
          })
        }).catch(() => {
        })
      },
      // 获取索引
      indexMethod (index) {
        return this.pageSize * (this.pageNo - 1) + index + 1
      },
      // 初始化数据服务
      getDataServiceList (boolean) {
        let params = {
          pageNum: this.pageNo,
          pageSize: this.pageSize,
          requestType: this.selectvalue,
          categoryId: this.categoryId,
          queryName: this.selectqueryName
        }
        if (!boolean) {
          this.$refs.table.clearSelection()
        }
        api.getDataServiceList(params).then(
          res => {
            this.tableData = res.data.pageInfo.list
            this.total = res.data.pageInfo.total
            console.log(res)
          },
          error => {
            console.log(error)
          }
        )
      },
      // 分页操作
      pageSizeChange (val) {
        this.pageSize = val
        this.getDataServiceList(true)
      },
      pageNoChange (val) {
        this.pageNo = val
        this.getDataServiceList(true)
      },
      //  测试弹框操作
      goNext () {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.isTesting = true
            let params = {}
            this.tableData2.map(val => {
              params[val.fieldCode] = val.input
            })
            api.testDataServiceState(params).then(res => {
              console.log(res)
              this.isTesting = false
              this.resultString = res.data.response
              this.result = JSON.parse(res.data.response)
              this.testStep = 2
            })
              .catch((error) => {
                console.log(error)
                this.isTesting = false
              })
          } else {
            return false
          }
        })
      },
      goPrevious () {
        this.testStep = 1
      },
      nodeChange (val) {
        this.categoryId = val
        this.getDataServiceList()
        this.node = val
      },
      handleCloseServiceTest () {
        this.tableData2 = []
        this.$refs['ruleForm'].resetFields()
        this.serviceTestVisible = false
      },
      serviceTest (val) {
        this.testStep = 1
        this.serviceTestVisible = true
        this.initPageInfo(val.serviceId, val.serviceCode)
        console.log(val, '当前字段信息')
      },
      // 如果是修改则查询id信息
      // 获取OrgInfoById的tokenKey
      // getOrgInfoById
      getTokenKey () {
        let params = {
          organizatioId: localStorage.getItem('organizationId')
        }
        api.getOrgInfoById(params).then(res => {
          this.tokenKey = res.data.list.tokenKey
          // console.log(res, 'tokenkey')
        })
      },
      initPageInfo (id, serviceCode) {
        let params = {
          serviceId: id
        }
        api.selectByServiceId(params).then(res => {
          console.log(res, 'id查找结果')
          if (res.data.code !== 0) {
            this.$message.error(res.data.msg)
            return
          }
          this.tableData2 = res.data.serviceEntity.fieldEntities.filter(val => {
            return val.fieldProperty === 1
          })
          this.tableData2.map(val => {
            if (val.fieldCode === 'serviceCode') {
              return this.$set(val, 'input', serviceCode)
            } else if (val.fieldCode === 'tokenKey') {
              return this.$set(val, 'input', this.tokenKey)
            } else {
              return this.$set(val, 'input', '')
            }
          })
          console.log(this.tableData2)
        })
      },
      //
      onCopy: function (e) {
        this.$message.success('复制成功')
      },
      onError: function (e) {
        console.log('无法复制文本！')
      },
      // this.$nextTick(() => { this.$refs.tree.setCurrentKey(this.chooseId) })
      // 获取当前的树形结构
      getTreeData () {
        let params = {
          type: 3
        }
        api.getSelectTypeList(params).then(res => {
          this.treeData = arrayToTree(res.data.list, {
            parentProperty: "parentid",
            customID: "categoryId"
          })
          console.log(this.treeData, '所有服务类型树形结构数据')
        })
      },
      // 移动操作
      moveData () {
        this.getTreeData()
        this.dialogVisible = true
      },
      moveDataTo () {
        let temp = []
        this.selectValue.map(res => {
          temp.push(res.serviceId)
        })
        let params = {
          serviceIds: temp.join(),
          categoryId: this.selectedNode.categoryId
        }
        api.moveDataServiceList(params).then(res => {
          if (res.data.code === 0) {
            console.log(res, '操作')
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.getDataServiceList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // end
      handleClose () {
        this.dialogVisible = false
      },
      nodeClick2 (val) {
        console.log(val)
        this.selectedNode = val
      },
      filterNode2 (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      handleSelectionChange (val) {
        this.selectValue = val
        console.log(this.selectValue)
      },
      editOrgInfo (val) {
        this.$router.push({path: `serviceInformationEdit/${val.serviceId}/null`})
      },
      addService () {
        let temp = this.categoryId === '' ? null : this.categoryId
        this.$router.push({path: `serviceInformationEdit/add/${temp}`})
      }
    },
    mounted () {
      this.getTokenKey()
      // this.getDataServiceList()
    },
    computed: {
      ruleForm () {
        return {
          'tableData': this.tableData2
        }
      }
    },
    filters: {
      getTime (val) {
        let date = new Date(val)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      getStatus (val) {
        return val === 0 ? '停用' : '启用'
      },
      getDataType (val) {
        if (val === 1) {
          return '数值型'
        } else if (val === 2) {
          return '字符型'
        } else if (val === 3) {
          return '日期型'
        } else if (val === 4) {
          return '枚举型'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../scss/tabel";
  /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
    background-color: #409EFF;
    border-color: #409EFF;
  }
  /deep/.el-tree--highlight-current .el-tree-node.is-current>.el-tree-node__content{
    background-color: #55a8fd;
    color: #fff;
    .el-button--text{
      color: #fff;
    }
  }
  /deep/.el-tree-node__content{
    height: 33px;
  }
  /deep/.mybtn{
    margin-left: 20px;
  }
  .body-content{
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .el-dialog__body{
    .el-input{
      margin-bottom: 20px;
    }
  }
  .box-contain{
    .row{
      display: flex;
      &>div:nth-child(1){
        text-align: right;
        vertical-align: middle;
        float: left;
        color: #606266;
        line-height: 40px;
        padding: 0 12px 0 0;
        box-sizing: border-box;
        width: 80px;
      }
      &>div:nth-child(2){
        flex: 1;
      }
      .result{
        line-height: 40px;
      }
      .result-contain{
        padding: 5px 15px;
        line-height: 1.5;
        box-sizing: border-box;
        width: 100%;
        color: #606266;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        height: 320px;
        overflow: auto;
        position: relative;
      }
    }
  }
  .grow{
    flex: 1;
    display: flex;
    width: 100%;
    border-right: 20px solid #f0f2f5;
    border-left: 20px solid #f0f2f5;
    box-sizing: border-box;
    .left{
      border-right: 1px solid #e7e7e7;
      flex: 1;
      overflow-x: scroll;
      position: relative;
      .left_inner{
        padding: 20px 10px;
        box-sizing: border-box;
        position: absolute;
        min-width: 100%;
      }
      .el-input{
        margin-bottom: 15px;
      }
    }
    .right{
      flex: 5;
      overflow-x: scroll;
      position: relative;
      .right-inner{
        position: absolute;
        padding: 20px;
        min-width: 100%;
        .btn-group{
          display: flex;
          flex-wrap: wrap;
          min-width: 1000px;
          justify-content: space-between;
          .el-select{
            width: 150px
          }
          .el-input{
            width: 200px;
          }
        }
      }
    }
  }
</style>
