<template>
  <div v-loading.fullscreen="loading" class="g-listpage__style">
    <div class="action-btn-container.space-inner">
      <div class="input-group"  >
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
     @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="37">
      </el-table-column>
      <el-table-column type="index" label="序号" width="50">
      </el-table-column>
      <el-table-column prop="merchantName" label="商户名称">
      </el-table-column>
      <el-table-column prop="merchantShortened" label="商户简称">
      </el-table-column>
      <el-table-column prop="merchantContactName" label="商户对接人">
      </el-table-column>
      <el-table-column prop="merchantContactPhone" label="对接人联系方式">
      </el-table-column>
      <el-table-column prop="merchantUrl" label="商户网址">
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
  </div>
</template>
<script>
import { api } from "@/api";
import util from "@/util/util";
import { formatDate } from "../../common/date.js";
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
      this.getMerchantList();
    },
    pageNoChange(pageNo) {
      this.pageNo = pageNo;
      this.getMerchantList();
    },
    dicSelsctChange(value) {
      console.log(value);
    },

    offTree() {
      for (var i = 0; i < this.$refs.tree.store._getAllNodes().length; i++) {
        this.$refs.tree.store._getAllNodes()[i].expanded = false;
      }
    },


    addFuc() {
    },
    openEditbox(row) {
      this.$router.push({
        path: "/admin/interface/merchantEdit/" + row.merchantId
      });
    },

    deleteFuc() {
    },

    updateStatus(status) {
    },

    getMerchantList() {
      api
        .getMerchantList({
          page: this.pageNo,
          limit: this.pageSize,
          queryName: this.searchForm.inputs
        })
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.page.list;
            if (res.data.page.list) {
              data.forEach(v => {
                v.status = v.status == 1 ? "启用" : "停用";
                v.isAssignAutho = v.isAssignAutho == 1 ? "启用" : "停用";
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

    // getMerchantList() {
    //   let url = "/api/sys/menu/perms?";
    //   api.getMerchantList(url).then(res => {
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
      this.getMerchantList();
    }
  },
  created() {
    this.getMerchantList();
    //this.getMerchantList();
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
