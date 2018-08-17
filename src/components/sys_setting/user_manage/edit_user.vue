<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span @click="quit" style="color:#20a0ff;cursor: pointer">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a;">
          <span>用户管理</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm('user')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom" id="edit-user-form">
      <el-form label-width="80px" :model="user" ref="user" >
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="姓名" prop="realname" :rules="rules.realnameRule">
              <el-input v-model="user.realname"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="手 机 号" prop="mobile" :rules="rules.phoneRule" >
              <el-input v-model="user.mobile" @input="phoneChange" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="所属组织" prop="organizationId" :rules="rules.organizationRule">
              <el-select :disabled="isDisabled"
               v-model="user.organizationId" placeholder="请选择"
                         @change="changeOrgan">
                <el-option
                  v-for="item in companies"
                  :key="item.organizationId"
                  :label="item.organizationName"
                  :disabled="item.disabled"
                  :value="item.organizationId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="所属角色" prop="roleId" :rules="rules.roleIdRule ">
              <el-select v-model="user.roleId" placeholder="请选择"
                         :disabled="!user.organizationId" height="36px"
                    >
                
                <el-option
                  v-for="item in roles"
                  :key="item.roleId"
                  :label="item.roleName"
                  :value="item.roleId">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="账号" prop="username">
              <el-input v-model="user.username" :disabled="currentPath==='editUser'"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="邮箱" prop="email" :rules="rules.emailRule ">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="14" :row="30">
            <el-form-item label="备注" prop="remark">
              <el-input  :autosize="{ minRows: 6, maxRows: 4}" v-model="user.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
  </div>
</template>
<script>
import { api } from "@/api";
import Rules from "../../../util/rules";

export default {
  data() {
    return {
      isDisabled: false,
      rules: Rules,
      backPath: "/admin/settings/userManage",
      formularExpress: [],
      user: {
        realname: "",
        mobile: "",
        username: "",
        email: "",
        remark: "",
        status: 1,
        roleId: "",
        organizationId: ""
      },
      roles: [],
      userRules: {},
      existRuleItem: {},
      userInitAccount: "",
      companies: [],
      currentPath: "",
      timeout: null
    };
  },
  methods: {
    phoneChange(value) {
      if (this.$route.params.id === "add") {
        this.user.username = value;
      }
    },
    quit() {
      this.$router.push(this.backPath);
    },
    // 保存验证操作
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.doneSaveOrUpdate();
        }
      });
    },
    doneSaveOrUpdate() {
      let payload = Object.assign({}, this.user);

      if (this.user.userId) {
        api.updateUserInfo(payload).then(
          data => {
            if (data.data.code == 0) {
              this.afterSuccessSave();
              return;
            }
            this.afterFailSave(data.data.msg);
          },
          error => {
            this.afterFailSave(error);
          }
        );
      } else {
        delete payload.userId;
        payload.organizationId = this.user.organizationId;
        payload.roleId = this.user.roleId;
        api.saveUserInfo(payload).then(
          data => {
            if (data.data.code == 0) {
              this.afterSuccessSave();
              return;
            }
            this.afterFailSave(data.data.msg);
          },
          error => {
            this.afterFailSave(error);
          }
        );
      }
    },
    changeOrgan(rule) {
      //切换重置角色
      if (!rule || rule !== true) {
        this.user.roleId = "";
      }
      api
        .getRoleListByOrgId({
          organizationId: this.user.organizationId
        })
        .then(
          data => {
            this.roles = data.data.list;
          },
          err => {
            console.log(err);
            this.$message.error("角色信息加载失败");
          }
        );
    },
    afterSuccessSave() {
      this.$message.success("用户保存成功");
      if (this.getParam() == "add") {
        this.$message.success("用户默认密码为：111111");
      }
      this.$router.push(this.backPath);
    },
    getParam() {
      let url = window.location.href;
      if (url.indexOf("?") != -1) {
        let obj = url.substr(url.indexOf("?") + 1);
        let key = obj.substr(0, obj.indexOf("="));
        return key;
      } else {
        return 0;
      }
    },
    afterFailSave(err) {
      console.log(err);
      this.$message.error(err);
    }
  },
  created() {
    if (this.$route.params.id !== "add") {
      this.currentPath = "editUser";
    }

    // 根据路由信息赋值userId
    this.user.userId =
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
    if (this.user.userId) {
      this.isDisabled = true;
      api.getUserInfoById({ userId: this.user.userId }).then(
        res => {
          this.user = res.data.list;
          this.userInitAccount = this.user.organizationId;
          this.changeOrgan(true);
        },
        err => {
          console.log(err);
          //          this.$message('用户信息加载失败')
        }
      );
    } else {
      this.user.organizationId = localStorage.getItem("organizationId");
      if ("admin" != localStorage.getItem("adminName")) {
        this.isDisabled = true;
      }
    }
  }
};
</script>
<style lang="scss">
#edit-user-form {
  .el-form-item__content {
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
@import "../../../scss/variables.scss";

$container-left: 78px;
$container-bottom: 50px;
$btn-container-bottom: 8px;
#edit-info {
  height: 100%;
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
    height: calc(100% - 38px);
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
