<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span @click="quit" style="color:#20a0ff;cursor: pointer">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a;">
        </div>
        <div style="float: right;margin-right: 20px;">
          <!-- <el-button size="small" @click="submitForm('user')" class="right">保存</el-button> -->
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom" id="edit-user-form">
      <el-form label-width="80px" :model="interface" ref="interface" >
        <el-row :gutter="30">
          <el-col :span="7">
            <el-form-item label="接口Code" prop="interfaceCode" :rules="rules.realnameRule">
              <el-input v-model="interface.interfaceCode" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="7">
            <el-form-item label="接口名称" prop="interfaceName" :rules="rules.phoneRule" >
              <el-input v-model="interface.interfaceName"  :disabled="true"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="16">
            <el-form-item label="支持供应商" prop="merchantIdList" :rules="rules.phoneRule" >
              <el-checkbox-group v-model="merchantIdList">
            <el-checkbox  v-for="item in merchantList"
                :key="item.merchantId"
                :value="item.merchantId"
                :label="item.merchantId"
                :disabled="true">{{item.merchantName}}</el-checkbox>
          </el-checkbox-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="16">
            <el-form-item label="接口入参"  :rules="rules.phoneRule" >
              <el-table :data="tableIntData" border class="g-table">
            <el-table-column prop="fieldName" label="字段名称">
            </el-table-column>
            <el-table-column prop="fieldCode" label="字段Code">
            </el-table-column>
            <el-table-column prop="dataType" label="值类型">
            </el-table-column>
            <el-table-column prop="required" label="必填">
            </el-table-column>
          </el-table>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="16">
            <el-form-item label="接口出参"  :rules="rules.phoneRule" >
              <el-table :data="tableBackData" border class="g-table">
            <el-table-column prop="fieldName" label="字段名称">
            </el-table-column>
            <el-table-column prop="fieldCode" label="字段Code">
            </el-table-column>
            <el-table-column prop="dataType" label="值类型">
            </el-table-column>
            <el-table-column prop="islist" label="数据集">
            </el-table-column>
          </el-table>
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
      rules: Rules,
      backPath: "/admin/interfaceManage",
      interface: {
        interfaceId: "",
        interfaceName: "",
        interfaceCode: null,
        status: null,
        cost: "",
        cachetime: "",
        fieldsInfo: [],
        merchantId: ""
      },
      merchantList: [],
      tableBackData: [],
      tableIntData: [],
      merchantIdList: []
    };
  },
  computed: {
    
  },
  methods: {
    quit() {
      this.$router.push(this.backPath);
    },
    getdataTypeName(val) {
      if (val === 1) {
        return "数值型";
      } else if (val === 2) {
        return "字符型";
      } else if (val === 3) {
        return "日期型";
      } else if (val === 4) {
        return "枚举型";
      }
    },
    getMerchantList() {
      api
        .getMerchantList({
          page: 1,
          limit: -1
        })
        .then(res => {
          if (res.data.code == 0) {
            this.merchantList = res.data.list;
          } else {
          }
        });
    }
  },
  created() {
    if (this.$route.params.id !== "add") {
      this.currentPath = "editUser";
    }

    // 根据路由信息赋值userId
    this.interface.interfaceId =
      this.$route.params.id !== "add" ? this.$route.params.id : "";

    this.getMerchantList();
    if (this.interface.interfaceId) {
      api.getInterfaceDetail({ interfaceId: this.interface.interfaceId }).then(
        res => {
          this.interface = res.data.list;
          this.merchantIdList.push(this.interface.merchantId);

          this.interface.fieldsInfo.forEach(v => {
            v.islist = v.islist == 1 ? "是" : "否";
            v.dataType = this.getdataTypeName(v.dataType);
            if (v.fieldProperty == 1) {
              this.tableIntData.push(v);
            } else {
              this.tableBackData.push(v);
            }
          });
        },
        err => {
          console.log(err);
          //          this.$message('用户信息加载失败')
        }
      );
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
