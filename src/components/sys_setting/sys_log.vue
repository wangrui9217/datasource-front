<template>
  <div v-loading.fullscreen="loading" class="g-listpage__style">
    <div class="action-btn-container.space-inner">
      <div class="input-group"  v-if="false">
        <el-input class="right search-btn" v-model.trim="searchForm.inputs"  placeholder="请输入关键词">
          <i class="iconfont-search el-input__icon" style="vertical-align: middle" slot="suffix" @click="searchFn"></i>
        </el-input>
      </div>
      <div class="right-top" v-if="false">
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
     >
      <el-table-column type="index" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="id" label="id">
      </el-table-column>
      <el-table-column prop="username" label="用户名">
      </el-table-column>
      <el-table-column prop="operation" label="用户操作">
      </el-table-column>
      <el-table-column prop="method" label="请求方法">
      </el-table-column>
      <el-table-column prop="params" label="请求参数">
      </el-table-column>
      <el-table-column prop="ip" label="ip地址">
      </el-table-column>
      <el-table-column prop="createDate" label="创建时间">
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
import { formatDate } from "../common/date.js";
//import arrayToTree from "array-to-tree";

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
      searchForm: {
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
    pageSizeChange(size) {
      this.pageSize = size;
      this.getSysLogList();
    },
    pageNoChange(pageNo) {
      this.pageNo = pageNo;
      this.getSysLogList();
    },
    dicSelsctChange(value) {
      console.log(value);
    },

    offTree() {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = false;
      }
    },

    addFuc() {},
    openEditbox(row) {
      this.$router.push({
        path: "/admin/interface/merchantEdit/" + row.merchantId
      });
    },

    deleteFuc() {},

    updateStatus(status) {},

    getSysLogList() {
      api
        .getSysLogList({
          page: this.pageNo,
          limit: this.pageSize
        })
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.page.list;
            if (res.data.page.list) {
              data.forEach(v => {
                var date = new Date(v.createDate);
                v.createDate = formatDate(date, "yyyy-MM-dd hh:mm:ss");
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

    // getSysLogList() {
    //   let url = "/api/sys/menu/perms?";
    //   api.getSysLogList(url).then(res => {
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
      this.getSysLogList();
    }
  },
  created() {
    this.getSysLogList();
    //this.getSysLogList();
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
