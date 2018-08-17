<template>
  <div class="body-content">
    <el-dialog
      title="请选择接口类型"
      :visible="dialogVisible"
      width="400px"
      :before-close="handleClose">
      <el-input
        placeholder="输入关键字进行过滤"
        v-model="filterText2">
      </el-input>
      <el-tree
        class="filter-tree"
        node-key="categoryId"
        :data="treeData"
        :props="treeProps"
        default-expand-all
        :highlight-current="true"
        :expand-on-click-node="false"
        @node-click="nodeClick2"
        :filter-node-method="filterNode2"
        ref="tree2">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="moveData" :disabled="selectedNode? false: true">确 定</el-button>
      </span>
    </el-dialog>
    <common-title title='接口管理'></common-title>
    <div class="grow">
      <common-tree @nodeChange="nodeChange" @refreshList="refreshList" :type="2"></common-tree>
      <div class="right">
        <div class="right-inner">
          <div class="btn-group">
            <span>
            <el-button type="info"  icon="el-icon-rank" @click="dialogVisible = true" :disabled="isMoveDisable">移动</el-button>
              </span>
            <span>
              <el-select v-model="merchantId"  placeholder="请选择" clearable="true">
                <el-option
                  v-for="item in merchantList"
                  :key="item.merchantId"
                  :label="item.merchantName"
                  :value="item.merchantId">
                </el-option>
              </el-select>
              <el-input class="formula-form" v-model="keyWords"  placeholder="请输入名称/Code"></el-input>
              <el-button type="primary" icon="el-icon-search" @click="getInterfaceList">搜索</el-button>
            </span>
          </div>
          <el-table :data="tableData" border class="g-table"
                    @selection-change="handleSelectionChange"
                    row-key="interfaceId" ref="table">
            <el-table-column type="selection" :reserve-selection="true" >
            </el-table-column>
            <el-table-column type="index" label="序号" :index="indexMethod">
            </el-table-column>
            <el-table-column prop="interfaceName" label="接口名称">
            </el-table-column>
            <el-table-column prop="interfaceCode" label="接口Code">
            </el-table-column>
            <el-table-column prop="merchantName" label="支持供应商">
            </el-table-column>
            <el-table-column prop="status" label="启用状态">
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" >
            </el-table-column>
            <el-table-column label="操作" >
              <template slot-scope="scope">
                <div class="actions">
                  <a @click="watchInfo(scope.row)">查看</a>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <!--<el-pagination-->
            <!--style="float:middle"-->
            <!--@size-change="pageSizeChange"-->
            <!--@current-change="pageNoChange"-->
            <!--:current-page="pageNo"-->
            <!--:page-sizes="[10, 20, 30, 40]"-->
            <!--:page-size="10"-->
            <!--layout="prev, pager, next, jumper,total, sizes"-->
            <!--:total="total">-->
          <!--</el-pagination>-->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { api } from "@/api";
import arrayToTree from "array-to-tree";
import { formatDate } from "../../common/date.js";
export default {
  watch: {
    filterText2(val) {
      this.$refs.tree2.filter(val);
    }
  },

  data() {
    return {
      multipleSelection: [],
      keyWords: "",
      categoryId: "",
      merchantId: "",
      isMoveDisable: true,
      node: "",
      menuVisible: false,
      selectedNode: "",
      categoryId: "",
      tableData: [],
      dialogVisible: false,
      typeInputs: "",
      treeData: [],
      merchantList: [],
      total: 0,
      pageSize: 10,
      pageNo: 1,
      value: "",
      filterText: "",
      filterText2: "",
      treeProps: {
        label: "name"
      }
    };
  },

  methods: {
    // 获取索引
    indexMethod(index) {
      return this.pageSize * (this.pageNo - 1) + index + 1;
    },

    nodeChange(val) {
      this.node = val;
    },

    watchInfo(val) {
      this.$router.push({
        path: "/admin/interfaceEdit/" + val.interfaceId
      });
    },
    moveData() {
      this.dialogVisible = false;

      let params = [];
      params = this.multipleSelection.map(item => {
        return item.interfaceId;
      });

      api
        .moveInterface({
          interfaceIds: params.join(","),
          categoryId: this.selectedNode.categoryId
        })
        .then(res => {
          if (res.data.code === 0) {
            this.$message.success("移动成功！");
            this.$refs.table.clearSelection()
            this.getInterfaceList();
          } else {
            this.$message.error(res.data.msg);
          }
        });
    },
    pageSizeChange(size) {
      this.pageSize = size;
      this.getInterfaceList();
    },
    pageNoChange(pageNo) {
      this.pageNo = pageNo;
      this.getInterfaceList();
    },
    handleClose() {
      this.dialogVisible = false;
    },
    nodeClick2(val) {
      console.log(val);
      this.selectedNode = val;
    },
    filterNode2(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleSelectionChange(val) {
      let that = this;
      if (val.length == 0) {
        that.isMoveDisable = true;
      } else {
        that.isMoveDisable = false;
      }
      this.multipleSelection = val;
    },

    refreshList(val) {
      this.$refs.table.clearSelection()
      this.categoryId = val;
      this.getInterfaceList();
    },

    getcategoryList() {
      api
        .getcategoryList({
          type: 2,
          name: this.typeInputs
        })
        .then(res => {
          if (res.data.code == 0) {
            if (res.data.list && res.data.list.length > 0) {
              let tmp = res.data.list;
              // this.categoryId = tmp[0].categoryId;
              this.treeData = arrayToTree(res.data.list, {
                parentProperty: "parentid",
                customID: "categoryId"
              });
              // this.getInterfaceList();
            }
          } else {
            this.tableData = [];
            this.total = 0;
          }
        });
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
    },
    getInterfaceList() {
      if (this.categoryId == 0) {
        this.categoryId = "";
      }
      api
        .getInterfaceList({
          // categoryId: this.categoryId,
          pageNum: this.pageNo,
          pageSize: this.pageSize,
          categoryId: this.categoryId,
          merchantId: this.merchantId,
          key: this.keyWords
        })
        .then(res => {
          if (res.data.code == 0) {
            let data = res.data.pageInfo.list;
            if (res.data.pageInfo.list) {
              data.forEach(v => {
                v.status = v.status == 1 ? "启用" : "停用";
                var date = new Date(v.updateTime);
                v.updateTime = formatDate(date, "yyyy-MM-dd hh:mm:ss");
              });
            }

            this.tableData = data;
            this.total = res.data.pageInfo.total;
          } else {
            this.tableData = [];
            this.total = 0;
          }
        });
    }
  },

  created() {
    this.getcategoryList();
    this.getMerchantList();
    this.getInterfaceList();
  },
  mounted() {}
};
</script>


<style lang="scss" scoped>
/deep/.el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: #55a8fd;
  color: #fff;
  .el-button--text {
    color: #fff;
  }
}
/deep/.el-tree-node__content {
  height: 33px;
}
/deep/.mybtn {
  margin-left: 20px;
}
.body-content {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.el-dialog__body {
  .el-input {
    margin-bottom: 20px;
  }
}
.grow {
  flex: 1;
  display: flex;
  width: 100%;
  border-right: 20px solid #f0f2f5;
  border-left: 20px solid #f0f2f5;
  box-sizing: border-box;
  .left {
    border-right: 1px solid #e7e7e7;
    flex: 1;
    overflow-x: scroll;
    position: relative;
    .left_inner {
      padding: 20px 10px;
      box-sizing: border-box;
      position: absolute;
      min-width: 100%;
    }
    .el-input {
      margin-bottom: 15px;
    }
  }
  .right {
    flex: 5;
    overflow-x: scroll;
    position: relative;
    .right-inner {
      position: absolute;
      padding: 20px;
      min-width: 100%;
      .btn-group {
        display: flex;
        justify-content: space-between;
        .el-select {
          width: 150px;
        }
        .el-input {
          width: 200px;
        }
      }
    }
  }
}
</style>
