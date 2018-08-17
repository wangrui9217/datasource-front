<template>
  <div class="flex-box">
    <el-dialog
      title="字段类型选择"
      :visible="dialogVisible"
      width="400px"
      :before-close="handleClose">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText2">
      </el-input>
      <el-tree
        class="filter-tree"
        node-key="categoryId"
        :data="treeData"
        :props="defaultProps"
        default-expand-all
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="nodeClick"
        :filter-node-method="filterNode2"
        ref="tree2">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="moveDataTo" :disabled="selectedNode? false: true">确 定</el-button>
      </span>
    </el-dialog>
    <common-title title='字段管理'></common-title>
    <div class="grow">
      <common-tree @nodeChange="nodeChange" :type="1"></common-tree>
      <div class="right">
        <div class="right-inner">
          <p>{{node}}</p>
          <div class="btn-group">
            <span>
            <el-button   icon="fa fa-arrows-alt" @click="moveData" :disabled="selectValue.length == 0">移动</el-button>
            <el-button   @click="changeService(0)" :disabled="selectValue.length == 0">
              <i class="iconfont-stop-color"></i>
              <span>停用</span>
            </el-button>
            <el-button   @click="changeService(1)" :disabled="selectValue.length == 0">
              <i class="iconfont-start-color"></i>
               <span>启用</span>
            </el-button>
              </span>
            <span>
              <el-select v-model="value" placeholder="请选择字段类型">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-input class="formula-form"  placeholder="请输入字段名称/字段代码" v-model="key"></el-input>
              <el-button type="primary" icon="el-icon-search" @click="search">搜索</el-button>
            </span>
          </div>
          <el-table :data="tableData" border class="g-table"
                    row-key="fieldId" ref="table"
                    @selection-change="handleSelectionChange">
            <el-table-column type="selection" :reserve-selection="true">
            </el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="fieldName" label="字段名称">
            </el-table-column>
            <el-table-column prop="fieldCode" label="字段Code">
            </el-table-column>
            <el-table-column prop="dataTypeName" label="值类型">
            </el-table-column>
            <el-table-column prop="statusName" label="启动状态">
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" >
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
  import arrayToTree from "array-to-tree";
  import { formatDate } from './../common/date'
  export default {

    data () {
      return {
        key: '',
        value: '',
        searchkey: '',
        searchvalue: '',
        total: null,
        selectValue: '',
        pageNo: 1,
        pageSize: 10,
        node: '',
        treeData: [],
        menuVisible: false,
        serviceTestVisible: false,
        selectedNode: '',
        selectId: '',
        id: 88,
        tableData: [],
        options: [{
          value: '',
          label: '全部'
        }, {
          value: '1',
          label: '数值型'
        }, {
          value: '2',
          label: '字符型'
        }, {
          value: '3',
          label: '日期型'
        }, {
          value: '4',
          label: '枚举型'
        }],
        dialogVisible: false,
        testStep: 1,
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
      // 获取索引
      indexMethod (index) {
        return this.pageSize * (this.pageNo - 1) + index + 1
      },
      // 更改状态
      changeService (val) {
        let state = val === 0 ? '停用' : '启用'
        this.$confirm(`确认${state}已选字段?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let temp = []
          this.selectValue.map(val => {
            temp.push(val.fieldId)
          })
          let params = {
            status: val,
            fieldIds: temp.join()
          }
          api.updateFields(params).then(res => {
            console.log(res)
          })
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
          this.getFieldList()
        }).catch(() => {
        })
      },
      search () {
        this.pageNo = 1
        this.pageSize = 10
        this.searchvalue = this.value
        this.searchkey = this.key
        this.getFieldList()
      },
      // 初始化数据服务
      getFieldList (boolean) {
        let params = {
          pageNum: this.pageNo,
          pageSize: this.pageSize,
          dataType: this.searchvalue,
          categoryId: this.selectId,
          fieldProperty: 0,
          key: this.searchkey
        }
        if (!boolean) {
          this.$refs.table.clearSelection()
        }
        api.getFieldList(params).then(
          res => {
            console.log(res, '数据结构')
            this.tableData = res.data.pageInfo.list || []
            if (this.tableData) {
              this.tableData.map(res => {
                this.$set(res, 'dataTypeName', this.getdataTypeName(res.dataType))
                this.$set(res, 'statusName', this.getstatusName(res.status))
                this.$set(res, 'updateTime', this.getTime(res.updateTime))
              })
            }
            this.total = res.data.pageInfo.total
          },
          error => {
            console.log(error)
          }
        )
      },
      getTime (val) {
        let date = new Date(val)
        return formatDate(date, 'yyyy-MM-dd hh:mm:ss')
      },
      getdataTypeName (val) {
        if (val === 1) {
          return '数值型'
        } else if (val === 2) {
          return '字符型'
        } else if (val === 3) {
          return '日期型'
        } else if (val === 4) {
          return '枚举型'
        }
      },
      getstatusName (val) {
        if (val === 1) {
          return '启用'
        } else if (val === 0) {
          return '停用'
        }
      },
      // 分页操作
      pageSizeChange (val) {
        this.pageSize = val
        this.getFieldList(true)
      },
      pageNoChange (val) {
        this.pageNo = val
        this.getFieldList(true)
      },
      //
      // this.$nextTick(() => { this.$refs.tree.setCurrentKey(this.chooseId) })
      // 移动字段
      moveData () {
        this.selectedNode = ''
        this.getTreeData()
        this.dialogVisible = true
      },
      moveDataTo () {
        let temp = []
        this.selectValue.map(res => {
          temp.push(res.fieldId)
        })
        let params = {
          fieldIds: temp.join(),
          categoryId: this.selectedNode.categoryId
        }
        api.moveFields(params).then(res => {
          if (res.data.code === 0) {
            // console.log(res, '操作')
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.getFieldList()
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 获取当前的树形结构
      getTreeData () {
        let params = {
          type: 1
        }
        api.getSelectTypeList(params).then(res => {
          this.treeData = arrayToTree(res.data.list, {
            parentProperty: "parentid",
            customID: "categoryId"
          })
        })
      },
      // end
      handleClose () {
        this.dialogVisible = false
      },
      nodeClick (val) {
        this.selectedNode = val
      },
      filterNode2 (value, data) {
        if (!value) return true
        return data.name.indexOf(value) !== -1
      },
      handleSelectionChange (val) {
        this.selectValue = val
        console.log(val)
      },
      // 获取树形组件传过来的id
      nodeChange (val) {
        // console.log(val, 'tree当前属性')
        this.key = ''
        this.value = ''
        this.searchkey = ''
        this.searchvalue = ''
        this.total = null
        this.selectValue = ''
        this.pageNo = 1
        this.pageSize = 10
        this.selectId = val
        this.getFieldList()
      }
    },
    mounted () {
    },
    computed: {
      ruleForm () {
        return {
          'tableData': this.tableData
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../scss/tabel";
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
