<template>
  <div v-loading.fullscreen="loading" class="g-listpage__style">
    <div class="action-btn-container.space-inner">
      <div class="input-group"  >
        <el-input class="right search-btn" v-model.trim="searchForm.inputs"  placeholder="请输入关键词">
          <i class="iconfont-search el-input__icon" style="vertical-align: middle" slot="suffix" @click="searchFn"></i>
        </el-input>
      </div>
      <div class="right-top" >
        <el-button type="primary" @click="addOrg"> 
          <span>+ 新增机构</span>
        </el-button>
        <el-button  @click="deleteFuc()" :disabled="!this.isHaveSelected">
          <i class="iconfont-remove-color" :class="{'icon-disable':!this.isHaveSelected}"></i>
          <span>删除</span>
        </el-button>
        <el-button  @click="updateStatus(1)" :disabled="!this.isHaveSelected">
          <i class="iconfont-start-color" :class="{'icon-disable':!this.isHaveSelected}"></i>
          <span>启用</span>
        </el-button>
        <el-button  @click="updateStatus(0)" :disabled="!this.isHaveSelected">
          <i class="iconfont-stop-color" :class="{'icon-disable':!this.isHaveSelected}"></i>
          <span>停用</span>
        </el-button>
      </div>
    </div>
    <el-table :data="tableData" border class="g-table"
     @selection-change="handleSelectionChange"
     row-key="organizationId" ref="table">
      <el-table-column type="selection" width="37" :reserve-selection="true">
      </el-table-column>
      <el-table-column type="index" label="序号" width="50" :index="indexMethod">
      </el-table-column>
      <!-- <el-table-column prop="userId" label="用户id">
      </el-table-column> -->
      <el-table-column prop="organizationName" label="机构名称">
      </el-table-column>
      <el-table-column prop="organizationCode" label="机构代码">
      </el-table-column> 
      <el-table-column prop="tokenKey" label="TOKEN-KEY">
      </el-table-column>
      <el-table-column prop="status" label="启用状态">
      </el-table-column>
      <el-table-column prop="updateName" label="更新人">
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间" width="80">
      </el-table-column>
       <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <div class="actions">
            <button @click="editOrgInfo(scope.row)" >修改</button>
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
</template>
<script>
import { api } from "@/api";
import util from "@/util/util";
import { formatDate } from "../../common/date.js";
export default {
  data() {
    return {
      isHaveSelected: false,
      formLabelWidth: "120px",
      dialogTitle: "",
      loading: false,
      date: "",
      total: 0,
      pageSize: 10,
      pageNo: 1,
      tableData: [],
      title: "新增",
      arbFormulaInfo: null,

      searchForm: {
        inputs: ""
      },
      multipleSelection: [],
      selectDicValue: "",
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },
  methods: {
    // 获取索引
    indexMethod(index) {
      return this.pageSize * (this.pageNo - 1) + index + 1;
    },
    handleSelectionChange(val) {
      // console.log(val);
      let that = this;
      if (val.length == 0) {
        that.isHaveSelected = false;
      } else {
        that.isHaveSelected = true;
      }
      this.multipleSelection = val;
    },

    pageSizeChange(size) {
      this.pageSize = size;
      this.getOrgList();
    },
    pageNoChange(pageNo) {
      this.pageNo = pageNo;
      this.getOrgList();
    },
    dicSelsctChange(value) {
      console.log(value);
    },

    addOrg() {
      this.$router.push({
        path: "/admin/settings/orgEdit/add"
      });
    },

    editOrgInfo(row) {
      this.$router.push({
        path: "/admin/settings/orgEdit/" + row.organizationId
      });
    },
    deleteFuc() {
      let params = [];
      params = this.multipleSelection.map(item => {
        return item.organizationId;
      });
      let msg = "确认删除已选的组织？";

      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.deleteOrg({ organizationIds: params.join(",") }).then(res => {
            if (res.data.code === 0) {
              this.$message.success("删除成功！");
              this.$refs.table.clearSelection();
              this.getOrgList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },

    updateStatus(status) {
      let params = [];
      params = this.multipleSelection.map(item => {
        return item.organizationId;
      });

      let msg = status == 1 ? "确认启用已选的组织？" : "确认停用已选的组织";

      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .updateOrgState({
              organizationIds: params.join(","),
              status: status
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$message.success(
                  status == 1 ? "启用成功！" : "停用成功！"
                );
                this.$refs.table.clearSelection();
                this.getOrgList();
              } else {
                this.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {});
    },

    getOrgList() {
      api
        .getOrgList({
          page: this.pageNo,
          limit: this.pageSize,
          organizationName: this.searchForm.inputs
        })
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.page.list;
            if (data) {
              data.forEach(v => {
                v.status = v.status == 1 ? "启用" : "停用";
                var date = new Date(v.updateTime);
                v.updateTime = formatDate(date, "yyyy-MM-dd hh:mm:ss");
              });
            }

            this.tableData = data;
            this.total = res.data.page.totalCount;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        });
    },

    searchFn() {
      this.pageNo = 1;
      this.getOrgList();
    }
  },
  created() {
    this.getOrgList();
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
action-btn-container {
  background: #fff;
  height: 66px;
  line-height: 66px;
  width: 100%;
  border-bottom: 1px solid #dedede;
  .right-top {
    text-align: left;
    height: 66px;
    //height: $action-btn-container-height;
    line-height: 66px;
    .right {
      //margin-top: 20px!important;
      .el-input__inner {
        border-top-width: 1px !important;
        border-bottom-width: 1px !important;
        border-radius: 4px !important;
      }
    }
  }
}
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
