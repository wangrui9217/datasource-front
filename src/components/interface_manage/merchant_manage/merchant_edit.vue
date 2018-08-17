<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span @click="quit" style="color:#20a0ff;cursor: pointer">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm('merchant')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom" id="edit-merchant-form">
      <el-form label-width="100px" :model="merchant" ref="merchant" >
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="商户名称" prop="merchantName" >
              <el-input v-model="merchant.merchantName" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商户简称" prop="merchantShortened"  :rules="rules.merchantShortened">
              <el-input v-model="merchant.merchantShortened"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="对接人" prop="merchantContactName" :rules="rules.merchantContactNameRule">
              <el-input v-model="merchant.merchantContactName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对接人手机" prop="merchantContactPhone" :rules="rules.phoneRule" >
              <el-input v-model="merchant.merchantContactPhone" ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="对接人QQ" prop="merchantContactQq" :rules="rules.merchantContactQq">
              <el-input v-model="merchant.merchantContactQq"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="对接人微信" prop="merchantContactWechat" :rules="rules.merchantContactWechat" >
              <el-input v-model="merchant.merchantContactWechat"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <el-form-item label="对接人邮箱" prop="merchantContactEmail" :rules="rules.emailRule">
              <el-input v-model="merchant.merchantContactEmail"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="商户网址" prop="merchantUrl" :rules="rules.merchantUrl" >
              <el-input v-model="merchant.merchantUrl"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="30">
          <el-col :span="8">
            <div class="g-address-box">
              <el-form-item label="商户地址" prop="merchantCity" >
                <el-input type="hidden" style="display: none" v-model.trim="merchant.merchantCity"></el-input>
                  <v-distpicker :province="merchant.province" :city="merchant.city" :area="merchant.area" @province="(val) =>{selectProvince(merchant, val)}" @city="(val) =>{selectCity(merchant, val)}" @area="(val) =>{selectArea(merchant, val)}" ></v-distpicker>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="8">
            <el-form-item label="详细地址" prop="merchantTown" :rules="rules.addressRule">
              <el-input v-model.trim="merchant.merchantTown" placeholder="街道、门牌号"></el-input>
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
import VDistpicker from "v-distpicker";
export default {
  components: { VDistpicker },
  data() {
    return {
      rules: Rules,
      backPath: "/admin/interface/merchantManage",
      formularExpress: [],
      merchant: {
        merchantId: "",
        merchantName: "",
        merchantShortened: "",
        merchantContactName: null,
        merchantContactPhone: null,
        merchantContactQq: "",
        merchantContactWechat: "",
        merchantContactEmail: "",
        merchantUrl: 1,
        merchantAddr: "",
        status: "",
        merchantCity: "",
        province: "",
        city: "",
        area: "",
        merchantTown: ""
      },
      roles: [],
      userRules: {},
      userInitAccount: "",
      companies: [],
      currentPath: ""
    };
  },
  methods: {
    selectCity(obj, val) {
      obj.city = val.value;
      obj.merchantCity = obj.province + " " + obj.city + " " + obj.area;
    },
    selectProvince(obj, val) {
      obj.province = val.value;
      obj.merchantCity = obj.province + " " + obj.city + " " + obj.area;
    },
    selectArea(obj, val) {
      obj.area = val.value;
      obj.merchantCity = obj.province + " " + obj.city + " " + obj.area;
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
      this.merchant.merchantAddr =
        this.merchant.merchantCity +','+ this.merchant.merchantTown;
      let payload = Object.assign({}, this.merchant);

      if (this.merchant.merchantId) {
        api.updateMerchantInfo(payload).then(
          data => {
            if (data.data.code == 0) {
              this.afterSuccessSave();
              return;
            } else {
              this.$message.error(data.data.msg);
            }
          },
          error => {
            this.afterFailSave(error);
          }
        );
      }
    },

    afterSuccessSave() {
      this.$message.success("保存成功");
      this.$router.push(this.backPath);
    },

    afterFailSave(err) {
      console.log(err);
      this.$message.error("保存失败");
    }
  },
  created() {
    if (this.$route.params.id !== "add") {
      this.currentPath = "edit";
    }

    // 根据路由信息赋值userId
    this.merchant.merchantId =
      this.$route.params.id !== "add" ? this.$route.params.id : "";

    if (this.merchant.merchantId) {
      api
        .getMerchantInfoByMerchantId({ merchantId: this.merchant.merchantId })
        .then(
          res => {
            this.merchant = res.data.list;
            if (this.merchant.merchantAddr) {
              let address = this.merchant.merchantAddr.split(",");
              this.merchant.merchantTown = address.splice(1).join(",");
              this.merchant.province = address[0].split(" ")[0];
              this.merchant.city = address[0].split(" ")[1];
              this.merchant.area = address[0].split(" ")[2];
              this.merchant.merchantCity = address[0];
            }
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
#edit-merchant-form {
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
