<template>
  <div class="flex-box">
    <common-title title='服务调用明细'></common-title>
    <div class="g-listpage__style flex-inner">
      <p>服务基本信息：</p>
      <common-box :data="data"></common-box>
      <p>请求基本信息：</p>
      <common-box :data="data2"></common-box>
      <div class="control">
        <el-radio-group v-model="labelShow" size="small">
          <el-radio-button label="left">列表展示</el-radio-button>
          <el-radio-button label="right">代码展示</el-radio-button>
        </el-radio-group>
      </div>
      <div class="container">
        <template v-if="labelShow === 'left'">
          <div>
            <label>输入数据:</label>
            <el-table :data="tableData" border >
              <el-table-column prop="serviceName" label="入参名称">
              </el-table-column>
              <el-table-column prop="serviceCode" label="入参编码">
              </el-table-column>
              <el-table-column prop="serverMessageKey" label="接口输入值">
              </el-table-column>
            </el-table>
          </div>
          <div>
            <label>结果返回:</label>
            <el-table :data="tableData" border >
              <el-table-column prop="realname" label="返回字段名称">
              </el-table-column>
              <el-table-column prop="code" label="返回字段编码">
              </el-table-column>
              <el-table-column prop="realname" label="返回字段值">
              </el-table-column>
            </el-table>
          </div>
        </template>
        <template v-else>
          <div>
            <label>输入数据:</label>
            <div class="box">
              {{dataServerRequest}}
            </div>
          </div>
          <div>
            <label>结果返回:</label>
            <div class="box">
             {{dataServerResponse}}
            </div>
          </div>
        </template>
      </div>
      <div class="content">
        <label>接口执行明细:</label>
        <el-table :data="integrationApiResults" border class="my">
          <el-table-column prop="interfaceName" label="接口名称">
          </el-table-column>
          <el-table-column prop="interfaceCode" label="接口Code">
          </el-table-column>
          <el-table-column prop="message" label="接口执行结果">
          </el-table-column>
          <el-table-column prop="costTime" label="接口用时">
          </el-table-column>
        </el-table>
      </div>
      <div class="content all-width">
        <label>异常服务内容:</label>
        <div class="error">{{errorInfo}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/api";
import util from "./../../util/util";
export default {
  data() {
    return {
      tableData: [],
      labelShow: "left",
      value: "",
      value2: "",
      data: [],
      data2: [],
      dataServerRequest: "",
      dataServerResponse: "",
      integrationApiResults: [],
      errorInfo:''
    };
  },
  watch: {},
  mounted() {
    this.initState();
  },
  methods: {
    getStatus(val) {
      return val === "0" ? "成功" : "失败";
    },
    initState() {
      let params = {
        recordId: this.$route.params.id
      };
      api.getServiceRedordById(params).then(res => {
        let data = res.data.dataServerMessage;
        let data2 = res.data.dataServerMessage.dataServerRequest;

        console.log(res, 888);
        this.data = [
          { label: "服务Code", value: data.serviceCode },
          { label: "服务名称", value: data2.serviceName },
          {
            label: "服务地址",
            value: data.addr
          },
          { label: "请求类型", value: data.callType }
        ];
        this.data2 = [
          { label: "机构名称", value: data2.organizationName },
          { label: "机构Key值", value: data.tokenKey },
          {
            label: "执行结果",
            value: this.getStatus(data.status)
          },
          { label: "耗时", value: data.costTime },
          {
            label: "服务请求时间",
            value: util.timestampToTime(data.requestTime)
          },
          {
            label: "服务响应时间",
            value: util.timestampToTime(data.responseTime)
          },
          {
            label: "请求服务器IP",
            value: data2.addr
          }
        ];

        this.integrationApiResults = data.integrationApiResults;
        this.dataServerRequest = data.dataServerRequest;
        this.dataServerResponse = data.dataServerResponse;
        if(data.dataServerResponse.erroMsg){
          this.errorInfo=data.dataServerResponse.erroMsg
        }else{
          this.errorInfo="无"
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.btn-group {
  display: flex;
  justify-content: flex-end;
  .el-input {
    width: 300px;
  }
  & > div,
  & > button {
    margin-left: 10px;
  }
}
.control {
  display: flex;
  justify-content: flex-end;
}
.container {
  display: flex;
  margin-top: 20px;
  justify-content: space-between;
  & > div {
    width: 45%;
    display: flex;
    .box {
      padding: 5px 15px;
      line-height: 1.5;
      box-sizing: border-box;
      flex: 1;
      color: #606266;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      height: 200px;
      overflow: auto;
    }
  }
  label {
    width: 100px;
    line-height: 48px;
    padding-right: 12px;
    text-align: right;
  }
}
.content {
  display: flex;
  margin-top: 40px;
  width: 60%;
  .error {
    flex: 1;
    color: #ff0000;
    line-height: 48px;
    word-break: break-word;
  }
  label {
    width: 100px;
    line-height: 48px;
    padding-right: 12px;
    text-align: right;
  }
}
.all-width {
  width: 100%;
}
</style>
