<template>
  <div v-loading.fullscreen="loading" class="g-listpage__style">
    <div class="action-btn-container.space-inner">
      <div class="input-group"  >
        <el-input class="right search-btn" v-model.trim="searchForm.inputs"  placeholder="请输入关键词">
          <i class="iconfont-search el-input__icon" style="vertical-align: middle" slot="suffix" @click="searchFn"></i>
        </el-input>
      </div>
      <div class="right-top" >
        <el-button type="primary" @click="addFuc"> 
          <span>+ 新增</span>
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
     row-key="roleId" ref="table">
      <el-table-column type="selection" width="37" :reserve-selection="true">
      </el-table-column>
      <el-table-column type="index" label="序号" width="50" :index="indexMethod">
      </el-table-column>
      <el-table-column prop="roleName" label="角色名称">
      </el-table-column>
      <el-table-column prop="organizationName" label="机构名称">
      </el-table-column>
      <el-table-column prop="isAssignAutho" label="权限分配状态">
      </el-table-column>
      <el-table-column prop="status" label="启用状态">
      </el-table-column>
      <el-table-column prop="updateName" label="更新人">
      </el-table-column>
      <el-table-column prop="updateTime" label="更新时间">
      </el-table-column> 
       <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <div class="actions">
            <button @click="openEditbox(scope.row)" >修改</button>
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
    <el-dialog :title="this.dialogTitle" :visible.sync="dialogFormVisible" @close="dialogClose">
      <el-form :model="dialogForm">
        <el-form-item label="角色名称" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.roleName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="备注" :label-width="formLabelWidth">
          <el-input v-model="dialogForm.remark" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="授权" :label-width="formLabelWidth">
          <el-tree 
          :data="menuList"
          :props="menuTreeProps"
          :checkedKeys="selectedKeys"
          :default-checked-keys="selectedKeys"
          :default-expanded-keys="selectedKeys"
          v-model="selectedKeys"
          node-key="menuId"
          show-checkbox
          ref="tree"
         ></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { api } from "@/api";
import util from "@/util/util";
//import arrayToTree from "array-to-tree";
import { formatDate } from "../../common/date.js";

export default {
  data() {
    return {
      menuTreeProps: {
        label: "name"
      },
      selectedKeys: [],
      menuList: [],
      isHaveSelected: false,
      formLabelWidth: "120px",
      dialogTitle: "",
      dialogFormVisible: false, //dialog 是否显示
      loading: false,
      date: "",
      total: 0,
      pageSize: 10,
      pageNo: 1,
      tableData: [],
      title: "新增",
      arbFormulaInfo: null,
      //弹框表单
      dialogForm: {
        roleName: "",
        roleId: "",
        remark: ""
      },
      searchForm: {
        roleName: "",
        inputs: ""
      },
      multipleSelection: []
    };
  },
  methods: {
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
    indexMethod(index) {
      return this.pageSize * (this.pageNo - 1) + index + 1;
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.getRoleList();
    },
    pageNoChange(pageNo) {
      this.pageNo = pageNo;
      this.getRoleList();
    },
    dicSelsctChange(value) {
      console.log(value);
    },

    offTree() {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = false;
      }
    },

    dialogClose() {
      this.selectedKeys = [];

      if (this.$refs.tree) {
        this.$refs.tree.setCheckedKeys(this.selectedKeys);
        this.offTree();
      }
    },

    addFuc() {
      this.$router.push({
        path: "/admin/settings/roleEdit/add"
      });
    },
    openEditbox(row) {
      this.$router.push({
        path: "/admin/settings/roleEdit/" + row.roleId
      });
    },

    deleteFuc() {
      let params = [];
      params = this.multipleSelection.map(item => {
        return item.roleId;
      });
      let msg = "确认删除已选的角色？";

      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api.deleteRole({ roleIds: params.join(",") }).then(res => {
            if (res.data.code === 0) {
              this.$message.success("删除成功！");
              this.$refs.table.clearSelection();
              this.getRoleList();
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
        return item.roleId;
      });

      let msg = status == 1 ? "确认启用已选的角色？" : "确认停用已选的角色";

      this.$confirm(msg, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          api
            .updateRoleState({
              roleIds: params.join(","),
              status: status
            })
            .then(res => {
              if (res.data.code === 0) {
                this.$message.success(
                  status == 1 ? "启用成功！" : "停用成功！"
                );
                this.$refs.table.clearSelection();
                this.getRoleList();
              } else {
                this.$message.error(res.data.msg);
              }
            });
        })
        .catch(() => {});
    },

    saveRoleInfo() {
      var add = this.dialogForm.roleId ? false : true;
      this.selectedKeys = this.$refs.tree.getCheckedKeys();
      let selectedKeysTemp = this.$refs.tree.getHalfCheckedKeys();
      for (var i in selectedKeysTemp) {
        this.selectedKeys.push(selectedKeysTemp[i]);
      }
      if (this.dialogForm.roleName == "") {
        this.$message.warning("请输入角色名称");
      } else if (this.dialogForm.remark == "") {
        this.$message.warning("请输入备注");
      } else if (this.selectedKeys.length == 0) {
        this.$message.warning("请选择授权");
      } else if (add) {
        console.log("MeYang", this.selectedKeys);
        let params = Object.assign({
          remark: this.dialogForm.remark,
          roleName: this.dialogForm.roleName,
          menuIdList: this.selectedKeys
        });
        this.loading = true;
        api.saveRoleInfo(params).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success("保存成功！");
            this.getRoleList();
          } else {
            this.$message.error(res.data.msg);
          }
        });
        this.dialogFormVisible = false;
      } else {
        let params = Object.assign({
          roleId: this.dialogForm.roleId,
          remark: this.dialogForm.remark,
          roleName: this.dialogForm.roleName,
          menuIdList: this.selectedKeys
        });
        this.loading = true;
        api.updateRoleInfo(params).then(res => {
          this.loading = false;
          if (res.data.code === 0) {
            this.$message.success("保存成功！");
            this.getRoleList();
          } else {
            this.$message.error(res.data.msg);
          }
        });
        this.dialogFormVisible = false;
      }
    },

    getRoleList() {
      api
        .getRoleList({
          page: this.pageNo,
          limit: this.pageSize,
          roleName: this.searchForm.inputs
        })
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.page.list;
            if (data) {
              data.forEach(v => {
                v.status = v.status == 1 ? "启用" : "停用";
                v.isAssignAutho = v.isAssignAutho == 1 ? "已分配" : "未分配";
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

    // getMenuList() {
    //   let url = "/api/sys/menu/perms?";
    //   api.getMenuList(url).then(res => {
    //     if (res.data.code == 0) {
    //       this.menuList = arrayToTree(res.data.menuList, {
    //         parentProperty: "parentId",
    //         customID: "menuId"
    //       });
    //     } else {
    //     }
    //   });
    // },
    searchFn() {
      this.pageNo = 1;
      this.getRoleList();
    }
  },
  created() {
    this.getRoleList();
    //this.getMenuList();
  },
  mounted() {}
};
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
