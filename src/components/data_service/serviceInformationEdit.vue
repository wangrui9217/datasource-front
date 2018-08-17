<template>
  <div id="edit-info">
    <el-dialog
      title="选择返回参数"
      :visible.sync="dialogVisible"
      width="900px">
      <div class="content">
        <div class="head-group">
          <el-select v-model="categoryId" placeholder="请选择字段类型">
            <el-option
              v-for="item in option"
              :key="item.categoryId"
              :label="item.name"
              :value="item.categoryId">
            </el-option>
          </el-select>
          <el-select v-model="dataType" placeholder="请选择">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input class="formula-form"  placeholder="字段代码/字段名称" v-model="key"></el-input>
          <span>已选择{{tableDataField2.length}}个字段</span>
        </div>
        <div class="body">
          <div class="left">
            <el-table :data="tableDataField" border
                      row-key="fieldId" class="min-800" ref="tree"
                      @selection-change="handleSelectionChange">
              <el-table-column type="selection" :reserve-selection="true">
              </el-table-column>
              <el-table-column prop="fieldCode" label="字段编码">
              </el-table-column>
              <el-table-column prop="fieldName" label="字段名称" >
              </el-table-column>
              <el-table-column prop="mobile" label="分类" >
              </el-table-column>
              <el-table-column  label="值类型" >
                <template slot-scope="scope">
                  {{scope.row.dataType|getDataType}}
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
          <div class="right">
            <el-table :data="tableDataField2" border max-height="800">
              <el-table-column prop="fieldCode" label="字段编码" fixed>
              </el-table-column>
              <el-table-column prop="fieldName" label="字段名称">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelChose">取 消</el-button>
        <el-button type="primary" @click="choseField" :disabled="tableDataField2.length === 0">确 定</el-button>
      </span>
    </el-dialog>
    <common-title title="新增/编辑服务信息"></common-title>
    <div class="edit-info-top">
      <el-row>
        <div class="leftBtn">
          <span @click="quit" class="back">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div class="rightBtn">
          <el-button size="small" @click="submitForm" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom" id="edit-user-form">
      <el-form label-width="100px" :model="ruleForm" ref="ruleForm" >
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="服务Code:" prop="serviceCode"   :rules="{required: true, message: '该项不能为空', trigger: 'blur'}">
              <el-input v-model="ruleForm.serviceCode"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="服务名称:" prop="serviceName" :rules="{required: true, message: '该项不能为空', trigger: 'blur'}" >
              <el-input v-model="ruleForm.serviceName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="请求类型:" prop="requestType" :rules="{required: true, message: '该项不能为空', trigger: 'change'}">
              <el-select v-model="ruleForm.requestType" placeholder="请选择">
                <el-option label="单次请求" :value="1"></el-option>
                <el-option label="多次请求" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="接口地址:" >
              <el-input v-model="serviceUrl" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="返回类型:" prop="responseType" :rules="{required: true, message: '该项不能为空', trigger: 'change'}">
              <el-select v-model="ruleForm.responseType" placeholder="请选择">
                <el-option label="同步" :value="1"></el-option>
                <el-option label="异步" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div class="edit-info">
        <div class="label">
          服务返回字段:
        </div>
        <div class="content">
          <el-table :data="tableData" border>
            <el-table-column prop="fieldName" label="字段名称" >
            </el-table-column>
            <el-table-column prop="fieldCode" label="字段Code">
            </el-table-column>
            <el-table-column label="值类型">
              <template slot-scope="scope">
                {{scope.row.dataType|getDataType}}
              </template>
            </el-table-column>
            <el-table-column label="数据集">
              <template slot-scope="scope">
                <div class="actions">
                  <el-checkbox  disabled v-if="scope.row.islist" :checked ="true"></el-checkbox>
                  <el-checkbox  disabled v-else :checked ="false"></el-checkbox>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <div class="actions">
                  <a @click="editOrgInfo(scope.row)">删除</a>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-button @click="dialogVisible = true" type="primary">+增加接口返回字段</el-button>
        </div>
      </div>
      <div class="edit-info mt20">
        <div class="label">
          服务入参字段:
        </div>
        <div class="content">
          <el-table :data="tableData2" border>
            <el-table-column prop="fieldName" label="字段名称" >
            </el-table-column>
            <el-table-column prop="fieldCode" label="字段Code">
            </el-table-column>
            <el-table-column label="值类型">
              <template slot-scope="scope">
                {{scope.row.dataType|getDataType}}
              </template>
            </el-table-column>
            <el-table-column label="必填">
              <template slot-scope="scope">
                <div class="actions">
                  <el-checkbox  disabled v-if="scope.row.required === 'Y'" :checked ="true"></el-checkbox>
                  <el-checkbox  disabled v-else :checked ="false"></el-checkbox>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { api } from '@/api'

  export default {
    data () {
      return {
        serviceUrl: '',
        ruleForm: {
          serviceName: '',
          serviceCode: '',
          requestType: '',
          responseType: ''
        },
        tableData: [],
        tableData2: [],
        tableDataField: [],
        tableDataField2: [],
        dialogVisible: false,
        value2: '',
        fieldProperty: '0',
        dataType: '',
        key: '',
        categoryId: '',
        option: [],
        options: [{
          value: '',
          label: '全部'
        }, {
          value: 1,
          label: '数值型'
        }, {
          value: 2,
          label: '字符型'
        }, {
          value: 3,
          label: '日期型'
        }, {
          value: 4,
          label: '枚举型'
        }],
        pageNo: 1,
        pageSize: 10,
        total: null
      }
    },
    methods: {
      // 取消选中
      cancelChose () {
        this.dialogVisible = false
        this.tableDataField2 = []
        this.$refs.tree.clearSelection()
      },
      // 获取接口地址
      getServiceUrl () {
        api.getDataServiceUrl().then(res => {
          if (res.data.code === 0) {
            this.serviceUrl = res.data.serviceUrl
          }
        })
      },
      // 如果是修改则查询id信息
      initPageInfo () {
        if (this.$route.params.id !== 'add') {
          let params = {
            serviceId: this.$route.params.id
          }
          api.selectByServiceId(params).then(res => {
            console.log(res, 'id查找结果')
            if (res.data.code !== 0) {
              this.$message.error(res.data.msg)
              return
            }
            this.ruleForm.serviceName = res.data.serviceEntity.serviceName
            this.ruleForm.serviceCode = res.data.serviceEntity.serviceCode
            this.ruleForm.requestType = res.data.serviceEntity.requestType
            this.ruleForm.responseType = res.data.serviceEntity.responseType
            // this.ruleForm.serviceUrl = res.data.serviceEntity.serviceUrl
            this.ruleForm.serviceId = res.data.serviceEntity.serviceId
            this.tableData = res.data.serviceEntity.fieldEntities.filter(val => {
              return val.fieldProperty === 2
            })
            this.tableData2 = res.data.serviceEntity.fieldEntities.filter(val => {
              return val.fieldProperty === 1
            })
          })
        }
      },
      quit () {
        this.$router.go(-1)
      },
      // 删除
      editOrgInfo (obj) {
        this.$confirm(`是否删除该字段?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.tableData.splice(this.tableData.indexOf(obj), 1)
        }).catch(() => {
        })
      },
      handleSelectionChange (val) {
        // console.log(val, 888)
        this.tableDataField2 = val
        // this.tableDataField2.push(...val)
        // console.log(this.tableDataField2, 999)
      },
      noRepeatPut (a, b) {
        a.map(val => {
          if (this.hasNoSameId(val.fieldId, b)) {
            b.push(val)
          }
        })
      },
      hasNoSameId (id, array) {
        let flag = true
        array.map(val => {
          if (val.fieldId === id) {
            flag = false
          }
        })
        return flag
      },
      // 添加返回字段操作
      choseField () {
        this.dialogVisible = false
        this.noRepeatPut(this.tableDataField2, this.tableData)
      },
      // 保存验证操作
      submitForm () {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            let params = Object.assign({}, this.ruleForm)
            let temp = []
            if (this.tableData instanceof Array && this.tableData.length !== 0) {
              this.tableData.map(val => {
                temp.push({'fieldId': val.fieldId, 'required': val.required})
              })
              if (this.tableData2 instanceof Array && this.tableData2.length !== 0) {
                this.tableData2.map(val => {
                  temp.push({'fieldId': val.fieldId, 'required': val.required})
                })
              }
              params['fieldEntities'] = temp
              if (this.$route.params.id === 'add') {
                params.categoryId = this.$route.params.categoryId === 'null' ? '' : this.$route.params.categoryId
                api.addDataServiceList(params).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('保存成功')
                    this.$router.go(-1)
                  } else {
                    this.$message.error(res.data.msg)
                  }
                })
              } else {
                api.updateDataServiceList(params).then(res => {
                  if (res.data.code === 0) {
                    this.$message.success('保存成功')
                    this.$router.go(-1)
                  } else {
                    this.$message.error(res.data.msg)
                  }
                })
              }
            } else {
              this.$message.error('请选择服务返回字段')
            }
          }
        })
      },
      // 获取字段类型
      getFieldType () {
        let params = {
          type: 1,
          name: ''
        }
        api.getSelectTypeList(params).then(res => {
          this.option = res.data.list
          if (this.option instanceof Array) {
            this.option.unshift({
              name: '全部',
              categoryId: ''
            })
          }
        })
      },
      // 获取字段信息
      getFieldInfoList () {
        let params = {
          pageNum: this.pageNo,
          pageSize: this.pageSize,
          dataType: this.dataType,
          key: this.key,
          categoryId: this.categoryId,
          fieldProperty: 2,
          status: 1
        }
        api.getFieldList(params).then(
          res => {
            console.log(res, 888)
            this.total = res.data.pageInfo.total
            this.tableDataField = res.data.pageInfo.list
          },
          error => {
            console.log(error)
          }
        )
      },
      // 获取输出字段
      pageSizeChange (val) {
        this.pageSize = val
        this.getFieldInfoList()
      },
      pageNoChange (val) {
        this.pageNo = val
        this.getFieldInfoList()
      }
    },
    watch: {
      tableData (curVal, oldVal) {
        let temp = []
        curVal.forEach(val => {
          temp.push(val.fieldId)
        })
        let params = {
          fieldIds: temp.join()
        }
        api.getQueryRequestFields(params).then(res => {
          console.log(res)
          this.tableData2 = res.data.fieldEntities
        })
      },
      categoryId (a, b) {
        this.pageNo = 1
        this.pageSize = 10
        this.total = null
        this.getFieldInfoList()
      },
      dataType (a, b) {
        this.pageNo = 1
        this.pageSize = 10
        this.total = null
        this.getFieldInfoList()
      },
      key (a, b) {
        this.pageNo = 1
        this.pageSize = 10
        this.total = null
        this.getFieldInfoList()
      }
    },
    mounted () {
      this.getFieldInfoList()
      this.initPageInfo()
      this.getFieldType()
      this.getServiceUrl()
    },
    filters: {
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
  #edit-info{
    .content{
      .head-group{
        padding: 10px 0;
        display: flex;
        align-items: center;
        .el-select{
          width: 130px;
        }
        .formula-form{
          width: 200px;
        }
        &>div{
          margin-right: 10px;
        }
      }
      .body{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        .left{
          width: 64%;
        }
        .right{
          width: 33%;
          height: 100%;
          overflow: hidden;
        }
      }
    }
  }
  /deep/ .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner{
    background-color: #409EFF;
    border-color: #409EFF;
  }
  .edit-info{
    display: flex;
    font-size: 14px;
    color: #606266;
    padding: 0 20px;
    .label{
      line-height: 40px;
      width: 100px;
      padding-right: 12px;
      text-align: right;
    }
    .content{
      width: 50%;
      .el-button{
        width: 100%;
        margin-top: 20px;
      }
    }
  }
  .min-800{
    min-height: 800px;
  }

  @import "../../scss/variables.scss";

  $container-left: 78px;
  $container-bottom: 50px;
  $btn-container-bottom: 8px;
  #edit-info {
    height: 100%;
    display: flex;
    flex-direction: column;
    .edit-info-top {
      border-bottom: 1px solid $split-color;
      height: $action-btn-container-height;
      line-height: $action-btn-container-height;
      .el-button--small {
        margin-top: 3px;
      }
      span {
        font-size: 14px;
      }
    }
    .el-tabs__header .el-tabs__nav-wrap {
      right: 0px;
    }

    .edit-info-bottom > .el-form {
      padding: 20px 20px;
      .userTitle {
        text-align: left;
        margin-bottom: 10px;
      }
      .el-form-item.is-required .el-form-item__label:before {
        content: none;
      }
      .el-form-item.is-required .el-form-item__label:after {
        content: "*";
        color: $require-text-color;
        margin-right: 4px;
        font-size: 12px;
      }

      .el-form-item__label {
        text-align: left;
      }
    }
    .edit-info-bottom {
      margin: 0px 0px;
      flex: 1;
      padding-bottom: 122px;
      overflow-y: auto;
      overflow-x: hidden;

      #condition-region .el-form {
        padding: 0px 0px;
      }
      .equals-container {
        text-align: center;
        position: relative;
        top: 5px;
      }
      .el-select {
        width: 100%;
        .el-input .el-input__inner {
          border: 0 !important;
          border-radius: 4px !important;
          height: 34px !important;
          line-height: 34px !important;
        }
      }
      .condition-container {
        position: relative;
        left: $container-left;
        bottom: $container-bottom;
        .btn-container {
          position: relative;
          bottom: $btn-container-bottom;
        }
        .el-form-item__content {
          margin-left: 0 !important;
        }
        .el-form {
          padding: 0;
        }
      }
    }
  }
</style>
