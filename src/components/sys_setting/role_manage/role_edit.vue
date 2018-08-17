<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span style="color:#20a0ff;cursor: pointer" @click="quit">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a; padding:5px;">
          <span>角色管理</span>
        </div>
        <div style="float: right;margin-right: 20px; padding:5px;">
          <el-button size="small" @click="submitForm('role')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom" id="edit-role">
      <el-form label-width="80px" :model="role" ref="role">
        <el-row :gutter="20" type="flex" class="row-bg" justify="left">
          <el-col :span="7">
            <el-form-item label="角色名" prop="roleName" :rules="rules.roleNameRule">
              <el-input v-model="role.roleName" ></el-input>
            </el-form-item>
          </el-col>
          <template >
            <el-col :span="7">
              <el-form-item label="组织" prop="organizationId" :class="{'is-error': ifOrganHasRecord}" :rules="rules.organizationRule">
                <el-select :disabled="isDisabled" v-model="role.organizationId" placeholder="请选择" @change="validateOrgan">
                  <el-option
                    v-for="item in companies"
                    :key="item.organizationId"
                    :label="item.organizationName"
                    :disabled="item.disabled"
                    :value="item.organizationId">
                  </el-option>
                </el-select>
                <template v-if="ifOrganHasRecord">
                  <div class="el-form-item__error">
                    已为该组织创建角色，请更换组织
                  </div>
                </template>
              </el-form-item>

            </el-col>
          </template>
        </el-row>
        <el-row>
          <el-col :span="14" :row="30">
            <el-form-item label="备注:" prop="remark" :rules="rules.roleRemarkRule">
              <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 4}" v-model="role.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :row="30">
            <el-form-item label="权限:" prop="promise">
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
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { api } from "@/api";
import util from "@/util/util";
import arrayToTree from "array-to-tree";
import Rules from "../../../util/rules";
export default {
  data() {
    return {
      isDisabled: false,
      rules: Rules,
      backPath: "/admin/settings/roleManage",
      menuTreeProps: {
        label: "name"
      },
      selectedKeys: [],
      menuList: [],
      user: {
        realname: "",
        mobile: "",
        organizationId: null,
        roleId: null,
        username: "",
        email: "",
        remark: "",
        status: 1
      },
      role: {
        roleId: "",
        roleName: "",
        organizationId: "",
        roleCode: "",
        roleDesc: "",
        menuIds: "",
        author: "",
        birth: "",
        status: 1,
        remark: ""
      },
      copiedOrganId: "",
      currentPath: "",
      timeout: null,
      roleRules: {},
      companies: [],
      ifAdmin: true,
      ifOrganHasRecord: false,
      copiedRoleName: ""
    };
  },
  watch: {},
  methods: {
    quit() {
      this.$router.push(this.backPath);
    },
    // 保存验证操作
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid && !this.ifOrganHasRecord) {
          this.doneSaveOrUpdate();
        }
      });
    },

    validateOrgan(rule, value, callback) {
      if (
        this.copiedOrganId &&
        this.copiedOrganId === this.role.organizationId
      ) {
        this.ifOrganHasRecord = false;
        return;
      }
      /*
        api.isHasManagerRole(this.role.organizationId).then(
              (res) => {
                if (res) {
                    this.ifOrganHasRecord = true
                } else {
                    this.ifOrganHasRecord = false
                }
              }, (err) => {
                    this.ifOrganHasRecord = false
              }
          )*/
    },

    getMenuList() {
      api
        .getMenuList({
          page: 1,
          limit: -1
        })
        .then(res => {
          if (res.data.code == 0) {
            this.menuList = arrayToTree(res.data.list, {
              parentProperty: "parentId",
              customID: "menuId"
            });
          } else {
          }
        });
    },

    doneSaveOrUpdate() {
      this.selectedKeys = this.$refs.tree.getCheckedKeys();
      let selectedKeysTemp = this.$refs.tree.getHalfCheckedKeys();
      for (var i in selectedKeysTemp) {
        this.selectedKeys.push(selectedKeysTemp[i]);
      }

      this.role.menuIds = this.selectedKeys.join(",");

      let payload = Object.assign({}, this.role);
      if (this.role.roleId) {
        api.updateRoleInfo(payload).then(
          data => {
            if (data.data.code == 0) {
              this.$message.success("保存成功！");
              this.$router.push(this.backPath);
            } else {
              this.$message.error(data.data.msg);
            }
          },
          error => {
            ResponseUtils.showErrorMessage(error, "角色保存失败");
          }
        );
      } else {
        delete payload.roleId;
        api.saveRoleInfo(payload).then(
          data => {
            if (data.data.code == 0) {
              this.$message.success("保存成功！");
              this.$router.push(this.backPath);
            } else {
              this.$message.error(data.data.msg);
            }
          },
          error => {
            ResponseUtils.showErrorMessage(error, "角色保存失败");
          }
        );
      }
    }
  },

  created() {
    this.getMenuList();
    if (this.$route.params.id !== "add") {
      this.currentPath = "editRole";
    }

    if (
      localStorage &&
      localStorage.getItem("admin_name") &&
      localStorage.getItem("admin_name") === "admin"
    ) {
      this.ifAdmin = true;
    }
    // 根据路由信息赋值roleId
    this.role.roleId =
      this.$route.params.id !== "add" ? this.$route.params.id : "";

    api.getOrgListForSelect().then(
      data => {
        // if (!this.user.organizationId) {
        //   // 默认选中第一个组织
        //   let defaultCheckOrgan = _.first(data.data);
        //   if (defaultCheckOrgan) {
        //     this.user.organizationId = defaultCheckOrgan.organizationId;
        //     if (this.$route.params.id === "add") {
        //       this.changeOrgan(false);
        //     }
        //   }
        // }
        this.companies = data.data.list;
        this.companies.forEach(v => {
          v.disabled = v.status == 1 ? false : true;
        });
      },
      () => {}
    );
    if (this.role.roleId != "add" && this.role.roleId != "") {
       this.isDisabled = true;
      api.getRoleInfoById({ roleId: this.role.roleId }).then(
        res => {
          this.role = res.data.list;
          //   this.copiedRoleName = _.cloneDeep(this.role.roleName);
          this.copiedOrganId = this.role.organizationId;
          this.role.organizationId = data.organizationId.toString();
        },
        err => {
          console.log(err);
          this.$message.error("角色信息加载失败");
        }
      );
      api.getMenuListByRoleId({ roleId: this.role.roleId }).then(
        res => {
          if (res.data.code == 0) {
            let idArr = res.data.menu.map(item => {
              if (item.parentId != 0) {
                return item.menuId;
              }
            });

            this.selectedKeys = idArr;
            this.$refs.tree.setCheckedKeys(this.selectedKeys);
          } else {
            this.$message.error(res.data.msg);
          }
        },
        err => {
          console.log(err);
          this.$message.error("角色信息加载失败");
        }
      );
    }else{
      this.role.organizationId = localStorage.getItem("organizationId");
      if ("admin" != localStorage.getItem("adminName")) {
        this.isDisabled = true;
      }
    }
  }
};
</script>

<style lang="scss">
#edit-role {
  .el-form-item__content {
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}
</style>
