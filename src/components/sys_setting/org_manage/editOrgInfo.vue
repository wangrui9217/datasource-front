<template>
  <div id="edit-organ-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span style="color:#20a0ff;cursor: pointer;" @click="quit">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;line-height:34px;margin-left:30px;color:#48576a;">
          <span>组织管理</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm('organ')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom" id="edit-organ">
      <el-form label-width="80px" :model="organ" ref="organ" >
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="名称" prop="organizationName" :rules="rules.orgNameRule">
              <el-input v-model="organ.organizationName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="代号" prop="organizationCode" :rules="rules.orgCodeRule">
              <el-input v-model="organ.organizationCode"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="14" :row="30">
            <el-form-item label="备注:" prop="remark" :rules="rules.orgRemarkRule">
              <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 4}" v-model="organ.remark"></el-input>
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
import Rules from "@/util/rules";
export default {
  data() {
    return {
      rules: Rules,
      backPath: "/admin/settings/orgManage",
      organ: {
        organizationId: "",
        organizationName: "",
        organizationCode: "",
        tokenKey: "",
        isdelete: "",
        email: "",
        status: 1,
        telephone: "",
        token: "",
        remark: ""
      },
      copiedOrganName: "",
      copiedOrganCode: "",
      organRules: {},
      timeout: null
    };
  },
  methods: {
    quit() {
      this.$router.push(this.backPath);
    },
    // 保存验证操作
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.doneSave();
        }
      });
    },
    doneSave() {
      let payload = Object.assign({}, this.organ);
      if (this.organ.organizationId) {
        api.updateOrgInfo({
          organizationName:this.organ.organizationName,
          organizationId:this.organ.organizationId,
          organizationCode:this.organ.organizationCode,
          remark:this.organ.remark
        }).then(
          data => {
            if (data.data.code == 0) {
              this.$message.success("保存成功！");
              this.$router.push(this.backPath);
            } else {
              this.$message.error(data.data.msg);
            }
          },
          error => {
            ResponseUtils.showErrorMessage(error, "组织保存失败");
          }
        );
      } else {
        delete payload.organizationId;
        api.saveOrgInfo(payload).then(
          data => {
            if (data.data.code == 0) {
              this.$message.success("保存成功！");
              this.$router.push(this.backPath);
            } else {
              this.$message.error(data.data.msg);
            }
          },
          error => {
            ResponseUtils.showErrorMessage(error, "组织保存失败");
          }
        );
      }
    },
    checkOrgan(rule, value, callback) {
      let self = this;
      if (self.organ.organizationId && value === self.copiedOrganName) {
        callback();
        return;
      }
      api
        .exitName(
          value,
          self.$route.params.id !== "add" ? self.$route.params.id : ""
        )
        .then(
          res => {
            if (res.data && value !== self.copiedOrganName) {
              callback(new Error("该组织名称已经存在，请重新输入"));
            } else {
              callback();
            }
          },
          err => {
            console.log(err);
            callback();
          }
        );
    },
    checkOrganCode(rule, value, callback) {
      let self = this;
      if (self.organ.organizationId && value === self.copiedOrganCode) {
        callback();
        return;
      }
      api
        .isHasOrganCode(
          value,
          self.$route.params.id === "add" ? "" : self.$route.params.id
        )
        .then(
          res => {
            if (res.data) {
              callback(new Error("该组织代号已经存在，请重新输入"));
            } else {
              callback();
            }
          },
          err => {
            console.log(err);
            callback();
          }
        );
    }
  },
  created() {
    // 根据路由信息赋值roleId
    this.organ.organizationId =
      this.$route.params.id !== "add" ? this.$route.params.id : "";
    // this.organRules = OrgansManageMock.organRules();
    // this.organRules.code.push({
    //   validator: this.checkOrganCode,
    //   trigger: "change"
    // });
    // this.organRules.name.push({
    //   validator: this.checkOrgan,
    //   trigger: "change"
    // });
    if (this.organ.organizationId) {
      api.getOrgInfoById({ organizatioId: this.organ.organizationId }).then(
        res => {
          if (res.data.code == 0) {
            this.organ = res.data.list;
            this.organ.organizationId = this.organ.organizationId.toString();
            this.copiedOrganName = this.organ.organizationName;
            this.copiedOrganCode = this.organ.organizationCode;
          }
        },
        err => {
          console.log(err);
          this.$message.error("组织信息加载失败");
        }
      );
    }
  }
};
</script>
<style lang="scss" scoped>
.userTitle {
  line-height: 36px;
  border-bottom: 1px dashed #dedede;
  margin-bottom: 15px;
}
#edit-organ-info {
  .edit-info-bottom {
    margin-left: 20px;
  }
}

.el-dialog__footer {
  text-align: center;
}
</style>
<style lang="scss">
#edit-organ {
  .el-form-item__content {
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}
</style>
