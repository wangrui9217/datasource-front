<template>
  <div class="tree-container">
    <ul id = "menu" v-show="menuVisible" @click="hideMenu">
      <li @click="addTreeNode" :class="{'not-allowed': chosedMenu[2]&& chosedMenu[2].level >= 4}">创建子类型</li>
      <li @click="menuRemove" :class="{'not-allowed': chosedNodeId === 0}">删除该节点</li>
      <li @click="menuChange"  :class="{'not-allowed': chosedNodeId === 0}">修改节点名称</li>
    </ul>
    <div class="box">
      <div class="inner">
        <el-input
          placeholder="输入关键字"
          v-model="filterText">
        </el-input>
        <el-tree
          :data="data"
          node-key="categoryId"
          :props="treeProps"
          default-expand-all
          :highlight-current="true"
          :expand-on-click-node="false"
          ref="tree"
          :allow-drop="allowDrop"
          :allow-drag="allowDrag"
          @node-drag-end="handleDragEnd"
          :filter-node-method="filterNode"
          @node-contextmenu="rihgtClick"
          @node-click="nodeClick"
          @current-change="nodeChange"
          :render-content="renderContent">
        </el-tree>
      </div>
      <!--<el-button @click="addTreeNode(true)" class="bottom" type="primary">新增服务分类</el-button>-->
    </div>
  </div>
</template>

<script>
import { api } from "@/api";
import arrayToTree from "array-to-tree";
export default {
  name: "commonTree",
  data () {
    return {
      chosedMenu: "",
      chosedNode: '',
      chosedNodeId: '',
      chosedParentId: '',
      doomObj: {},
      menuVisible: false,
      filterText: "",
      categoryId: 88,
      data: [],
      treeData: [],
      treeProps: {
        label: 'name',
        children: 'children'
      }
    }
  },
  methods: {
    // 根据id获取父级id
    getParentId (id, array) {
      if (array instanceof Array) {
        let temp = ''
        array.map(val => {
          if (val.categoryId === id) {
            temp = val.parentid
          }
        })
        return temp
      }
    },
    // 初始化获取树形结构
    getTreeData () {
      let params = {
        type: this.type
      }
      return new Promise((resolve, reject) => {
        api.getSelectTypeList(params).then(res => {
          console.log(res, '树形结构')
          this.treeData = res.data.list
          let temp = JSON.parse(JSON.stringify(res.data.list))
          if (temp && temp instanceof Array) {
            this.data = arrayToTree(temp, {
              parentProperty: "parentid",
              customID: "categoryId"
            })
          }
          let temp2 = [{
            categoryId: 0,
            name: this.totalName,
            children: this.data
          }]
          this.data = temp2
          console.log(this.data)
          resolve()
        })
      })
    },
    // 拖到树形结构
    allowDrop (draggingNode, dropNode, type) {
      if (dropNode.key === 0) {
        return false
      } else {
        return true
      }
    },
    allowDrag (draggingNode) {
      return draggingNode.key !== 0
    },
    handleDragEnd (draggingNode, dropNode, dropType, ev) {
      let parentId = ''
      if (dropType === 'none') {
        return
      }
      if (dropNode) {
        if (dropType === 'inner') {
          parentId = dropNode.key
        } else {
          parentId = this.getParentId(dropNode.key, this.treeData)
        }
      }
      let params = {
        categoryId: draggingNode.key,
        toCategoryId: parentId
      }
      api.moveSelectTypeList(params).then(res => {
        if (res.data.code === 0) {
          this.$message.success("移动成功！")
        } else {
          this.$message.error(res.data.msg)
        }
        this.getTreeData().then(() => {
          this.$refs.tree.setCurrentKey(this.chosedNodeId)
        })
      })
    },
    // end
    hideMenu(e) {
      e.preventDefault();
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    nodeClick (val) {
      this.chosedNodeId = val.categoryId
      this.menuVisible = false

       if (this.type == 2) {
        //根据类型id 刷新列表数据
        this.$emit("refreshList", val.categoryId);
      }

    },
    nodeChange(data, node) {
      // console.log(data, node, 444444);
    },
    rihgtClick (event, object, value, element) {
      // console.log(event, object, value, element)
      this.chosedNodeId = object.categoryId
      this.chosedParentId = object.parentid
      this.$nextTick(() => { this.$refs.tree.setCurrentKey(this.chosedNodeId) })
      this.menuVisible = true
      let menu = document.querySelector('#menu')
      menu.style.left = event.clientX - this.doomObj.x + "px"
      menu.style.top = event.clientY - this.doomObj.y + "px"
      this.chosedMenu = [event, object, value, element]
    },
    // 表单右击增删改
    // 增
    addTreeNode (flag) {
      // if (this.chosedMenu[2].level >= 4) {
      //   this.$message.error('最多四级菜单')
      //   return
      // }
      this.$prompt("请输入类型名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: '名称不能为空',
      })
        .then(({ value }) => {
          let params = {
            name: value,
            type: this.type,
            parentId: this.chosedNodeId === 0 ? '' : this.chosedNodeId
          }
          api.addSelectTypeList(params).then(res => {
            if (res.data.code == 0) {
              this.$message.success("保存成功！");
              this.getTreeData().then(() => {
                this.$nextTick(() => {
                  this.$refs.tree.setCurrentKey(this.chosedNodeId)
                })
              })
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
    // 删除选中数据成功自动选中父级数据
    menuRemove () {
      if (this.chosedNodeId === 0) {
        return
      }
      this.$confirm("确定要删除该节点吗？", "温馨提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let params = {
            categoryIds: this.chosedNodeId
          };
          api.deleteSelectTypeList(params).then(res => {
            if (res.data.code === 0) {
              console.log(res)
              this.$message.success("删除成功！")
              this.chosedNodeId = this.chosedParentId
              this.getTreeData().then(() => {
                this.$nextTick(() => {
                  this.$refs.tree.setCurrentKey(this.chosedNodeId)
                })
              })
            } else {
              this.$message.error(res.data.msg)
            }
          })
        })
        .catch(() => {})
    },
    // 改：修改节点名称
    menuChange () {
      if (this.chosedNodeId === 0) {
        return
      }
      this.$prompt("请修改节点名称", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /\S/,
        inputErrorMessage: '名称不能为空',
        inputValue: this.chosedMenu[1].name
      })
        .then(({ value }) => {
          let params = {
            name: value,
            categoryId: this.chosedNodeId,
            type: this.type
          }
          api.updateSelectTypeList(params).then(res => {
            if (res.data.code === 0) {
              this.$message.success('修改成功')
              this.getTreeData().then(() => {
                this.$nextTick(() => {
                  this.$refs.tree.setCurrentKey(this.chosedNodeId)
                })
              })
            } else {
              this.$message.error(res.data.msg)
            }
            console.log(res)
          })
        })
        .catch(() => {})
    },
    renderContent(h, { node, data, store }) {
      return (
        <span class="custom-tree-node">
        <i class="fa fa-align-justify my-icon"></i>
          <span>{node.label}</span>
        </span>
      );
    }
  },
  props: {
    type: {
      default: 1
    }
  },
  mounted () {
    this.getTreeData().then(() => {
      this.chosedNodeId = 0
      this.$refs.tree.setCurrentKey(this.chosedNodeId)
    })
    this.$nextTick(() => {
      let query = document.querySelector('.tree-container')
      this.doomObj = query.getBoundingClientRect()
    })
    let _this = this
    document.body.onclick = function () {
      _this.menuVisible = false
    }
  },
  components: {},
  filters: {},
  computed: {
    totalName () {
      if (this.type === 1) {
        return '字段分类'
      } else if (this.type === 2) {
        return '接口分类'
      } else if (this.type === 3) {
        return '服务分类'
      } else {
        return 'total'
      }
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    },
    chosedNodeId (a, b) {
      this.$emit("nodeChange", a === 0 ? '' : a)
    }
  }
}
</script>

<style lang="scss" scoped>
$color: #55a8fd;
.not-allowed{
  opacity: 0.6;
  cursor: not-allowed !important;
  pointer-events: none;
}
#menu {
  position: absolute;
  background: #f5f5f5;
  border: 1px solid #979797;
  box-shadow: 2px 2px 2px #999;
  z-index: 999;
  & > li {
    display: block;
    padding: 0 2em;
    text-decoration: none;
    width: auto;
    color: #000;
    white-space: nowrap;
    line-height: 2.4em;
    text-shadow: 1px 1px 0 #fff;
    border-radius: 1px;
  }
  & > li:hover {
    cursor: pointer;
    background-color: #e8eff7;
    box-shadow: 0 0 2px #0a6aa1;
  }
}
.el-input {
  margin-bottom: 20px;
}
.tree-container {
  position: relative;
  width: 250px;
  border-right: 1px solid #e7e7e7;
  .inner {
    padding: 20px 10px;
    box-sizing: border-box;
    flex: 1;
    display: flex;
    flex-direction: column;
    .el-tree{
      flex: 1;
      overflow: auto;
    }
  }
  .box {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    .bottom{
      margin-bottom: 20px;
    }
  }
}
/deep/ .el-tree-node__content {
  height: 36px;
}
/deep/ .el-tree-node__content:hover {
  background-color: #dcedfe;
}
/deep/ .el-tree--highlight-current
  .el-tree-node.is-current
  > .el-tree-node__content {
  background-color: $color;
  color: #fff;
  .el-button--text {
    color: #fff;
  }
  /deep/ .my-icon{
    color: #fff;
  }
}
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
  /deep/ .my-icon{
    margin-right: 10px;
    transform: rotate(90deg);
    color: $color;
  }
</style>
