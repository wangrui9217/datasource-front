<template>
  <div id="edit-info">
    <div class="edit-info-top">
      <el-row>
        <div style="margin-left: 20px; width: 50px;float: left;">
          <span style="color:#20a0ff;cursor: pointer" @click="quit">&lt;</span>
          <el-button type="text" @click="quit">返回</el-button>
        </div>
        <div style="width: 80px;float: left;margin-left:30px;color:#48576a;">
          <span>资源{{source.isEdit}}</span>
        </div>
        <div style="float: right;margin-right: 20px;">
          <el-button size="small" @click="submitForm('source')" class="right">保存</el-button>
        </div>
      </el-row>
    </div>
    <div class="edit-info-bottom" id="edit-sourde-info">
        <el-form label-width="80px" :model="source" ref="source" >
	        <el-row :gutter="30">
	          <el-col :span="7">
	            <el-form-item label="菜单名称" prop="name" :rules="rules.menuNameRule">
	              <el-input v-model="source.name" ></el-input>
	            </el-form-item>
	          </el-col>
	          <el-col :span="7">
	            <el-form-item label="菜单类型" prop="type" :rules="rules.menuTypeRule">
                  <el-select v-model="source.type" placeholder="请选择" @change="selectChange">
                    <el-option
                      v-for="item in companies"
                      :key="item.type"
                      :label="item.name"
                      :value="item.type">
                    </el-option>
                  </el-select>
	            </el-form-item>
	          </el-col>
	       </el-row>
	       <el-row :gutter="30">
	          <el-col :span="7"  v-if="source.type=='1'||source.type=='2'">
	            <el-form-item label="上级菜单" prop="parentId" :rules="rules.parentIdRule" >
                <el-select v-model="source.parentId" placeholder="请选择上级菜单">
                  <el-option
                    v-for="item in menuList"
                    :key="item.menuId"
                    :label="item.name"
                    :value="item.menuId">
                  </el-option>
                </el-select>
            </el-form-item>
	          </el-col>
           <el-col :span="7">
             <el-form-item v-if="false" label="菜单图标" prop="icon">
               <el-input v-model="source.icon" :disabled="this.$route.params.id !== 'add'" ></el-input>
             </el-form-item>
           </el-col>
	        </el-row>
          <el-row :gutter="30">
            <el-col :span="14">
              <el-form-item label="菜单url" prop="path">
                <el-input v-model="source.url" ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="14" :row="30">
              <el-form-item label="备注" prop="remark">
                <el-input type="textarea" :autosize="{ minRows: 6, maxRows: 4}" v-model="source.remark"></el-input>
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
import Rules from "../../../util/rules";
export default {
  data() {
    return {
      rules: Rules,
      backPath: "/admin/settings/menuManage",
      source: {
        menuId: null,
        parentId: null,
        code: "",
        name: "",
        url: "",
        icon: "",
        type: "",
        isEdit: "",
        path: "",
        status: 1
      },
      checkStrictly: true,
      sourceRules: {},
      menuList: [],
      firstLevelMenuList: [],
      secondLevelMenuList: [],
      companies: [{ name: "一级菜单", type: 0 }, { name: "二级菜单", type: 1 }],
      tree: {
        node: {
          id: "menuId",
          parentId: "parentId"
        },
        treeData: [],
        defaultProps: {
          children: "children",
          label: "name"
        },
        checkedKeys: [],
        treeRef: "",
        filter: {
          radio: true
        }
      },
      nodesPromise: null,
      sourcePromise: null
    };
  },
  methods: {
    quit() {
      this.$router.push(this.backPath);
    },
    checkChange(ref) {
      this.tree.checkedKeys = [ref];
    },

    // 保存验证操作
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.doneSaveOrUpdate();
        }
      });
    },
    //保存操作
    doneSaveOrUpdate() {
      let payload = this.source;
      if (!this.source.menuId) {
        delete payload.menuId;
        api.saveMenuInfo(payload).then(
          data => {
            if (data.data.code == 0) {
              this.afterSuccessSave(data);
            } else {
              this.$message.error(data.data.msg);
            }
          },
          error => {
            this.afterFailSave(error);
          }
        );
      } else {
        api.updateMenuInfo(payload).then(
          data => {
             if (data.data.code == 0) {
              this.afterSuccessSave(data);
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
    afterSuccessSave(data) {
      if (data.data.code == 0) {
        this.$message.success("资源保存成功");
      } else {
        this.$message.error(data.data.msg);
      }

      this.$router.push(this.backPath);
    },
    afterFailSave(err) {
      console.log(err);
      this.$message.error("资源保存失败");
    },
    //下拉选择隐藏菜单path
    selectChange(data) {
      // if(data == '0'){
      //   this.resource.route.path = '';
      // }
    }
  },
  created() {
    // 根据路由信息赋值roleId
    this.source.menuId =
      this.$route.params.id !== "add" ? this.$route.params.id : "";
    this.source.isEdit = this.$route.params.id === "add" ? "新增" : "编辑";

    // if (this.$route.params.id === "add") {
    //   let existSourceItem = { validator: this.checkAccout, trigger: "blur" };
    //   this.sourceRules.name.push(existSourceItem);
    // }

    if (this.source.menuId) {
      let thisObj = this;
      api.getMenuInfoByMenuId({ menuId: this.source.menuId }).then(
        data => {
          thisObj.source = data.data.menu;
          thisObj.source.isEdit = "编辑";
          thisObj.tree.checkedKeys = [this.source.parentId];
        },
        err => {
          console.log(err);
        }
      );
    }

    //上级菜单初始化数据
    api
      .getMenuList({
        page: 1,
        limit: -1
      })
      .then(res => {
        this.firstLevelMenuList = [];
        this.secondLevelMenuList = [];
        res.data.list.forEach(element => {
          if (element.type == 0) {
            this.firstLevelMenuList.push(element);
          }
          if (element.type == 1) {
            this.secondLevelMenuList.push(element);
          }
        });

        this.menuList = this.firstLevelMenuList;

        //去掉默认选择 展示请选择
        //this.source.parentId = this.menuList[0].menuId;
        // if (thisObj.source.isEdit !== "编辑") {
        //   this.source.parentId = "";
        // }
      });
  }
};
</script>
<style lang="scss">
#edit-sourde-info {
  .el-form-item__content {
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
.userTitle {
  line-height: 36px;
  border-bottom: 1px dashed #dedede;
  margin-bottom: 15px;
}
.el-dialog__footer {
  text-align: center;
}
.el-select {
  width: 407px;
}
</style>
