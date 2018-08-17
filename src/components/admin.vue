<template>
  <el-container>
    
    <el-header>
      <el-row>
        <el-col :span="4">
          <div class="logo"><img src="../assets/logo.png">数据源</div>
        </el-col>
        <el-col :span="8" :offset="12" style="text-align:right">
          <div class="btnwork">
            <el-popover
            ref="popover"
              placement="bottom"
              width="400"
              trigger="manual">
              <label>YYYYYY</label>
              </el-popover>
            <span style="margin-right:15px">欢迎登陆，<label v-popover:popover>{{user_fullname}}</label></span>
            
            <!-- <a style="cursor:pointer" @click="goMsg()"><i class="fa fa-bullhorn" aria-hidden="true"></i>我的消息<el-badge is-dot class="item" v-if="msgRedShow"></el-badge></a> -->
            <a style="cursor:pointer" @click.prevent="logout"><i class="fa fa-power-off" aria-hidden="true"></i>退出</a>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" style="background-color:#22345E">
        <el-menu text-color="#fff" :router="true" :default-active="$route.path" class="g-el-menu">
          <div v-for="b in menulist">
            <el-submenu v-if="b.type==0" :index="'' + b.menuId" >
              <template slot="title">
                <i :class="b.icon"></i>
                <span>{{b.name}}</span>
              </template>
              <div v-for="c in b.list">
                <el-submenu v-if="c.type==0" :index="'' + c.menuId" >
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{c.name}}</span>
                  </template>
                  <div v-for="d in c.list">
                    <el-submenu v-if="d.type==0" :index="'' + d.menuId">
                      <template slot="title">
                        <i class="el-icon-location"></i>
                        <span>{{d.name}}</span>
                      </template>
                    </el-submenu>
                    <el-menu-item v-if="d.type==1" :index="d.url" :key="d.menuId">
                      <template slot="title">{{d.name}}</template>
                    </el-menu-item>
                  </div>
                </el-submenu>
                <el-menu-item v-if="c.type==1" :index="c.url" :key="c.menuId" >
                  <template slot="title">{{c.name}}</template>
                </el-menu-item>
              </div>
            </el-submenu>
            <el-menu-item v-if="b.type==1" :index="b.url" :key="b.menuId">
              <template slot="title">{{b.name}}</template>
            </el-menu-item>
          </div>

          <!-- <el-submenu index="a14444">
            <template slot="title">
              <i class="fa fa-cog fa-fw"></i>
              <span>系统设置</span>
            </template>
            <el-menu-item index="/admin/settings/orgManage">
              <template slot="title">组织管理</template>
            </el-menu-item>
            <el-menu-item index="/admin/settings/adminManageList">
              <template slot="title">管理员列表</template>
            </el-menu-item>
            <el-menu-item index="/admin/settings/roleManage">
              <template slot="title">角色管理</template>
            </el-menu-item>
            <el-menu-item index="">
              <template slot="title">菜单管理</template>
            </el-menu-item>
          </el-submenu> -->
          
        </el-menu>
      </el-aside>
      <el-main class="admin_main">
        <!-- <breadcrumb></breadcrumb> -->
        <router-view @upup="change"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import { api } from "@/api";
//import breadcrumb from "@/components/common/breadcrumb";
export default {
  //   components: { breadcrumb },
  data() {
    return {
      menulist: [],
      msgNum: 0,
      msgRedShow: false,
      user_fullname: "" //登陆名字
    };
  },
  methods: {
    msgUnread() {
      var params = {
        pageSize: 10,
        type: 2,
        pageNo: 1
      };
      api.queryMessageListByType(params).then(res => {
        if (res.data.code == "1") {
          let data = res.data.data;
          let msglenth = data.hasOwnProperty("list") ? data.list.length : 0;
          if (msglenth > 0) {
            this.msgRedShow = true;
          }
        }
      });
    },
    change(msg) {
      this.msgRedShow = msg;
    },
    logout() {
      this.$router.push({
        path: "/userLogin"
      });
      // api.sysLogout({
      //   accessToken: localStorage.getItem("adminOutAccessToken")
      // });
      // localStorage.removeItem("adminOutAccessToken");
      // localStorage.removeItem("adminAccessToken");
      // this.$router.push({
      //   path: "/userLogin"
      // });
    },
    getMenu() {
      api.menuList().then(res => {
        if (res.data.code === 0) {
          this.menulist = res.data.menuList;
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    goMsg() {
      this.$router.push({ path: "/admin/manage/adminMsg" });
    }
  },
  mounted() {
    this.user_fullname = localStorage.getItem("adminName");
    this.getMenu();
    // this.msgUnread();
  }
};
</script>
<style scoped lang="scss">
.admin_main {
  min-width: 1160px;
  background: #fff;
  padding: 0;
}
.el-header {
  min-width: 1360px;
  border-bottom: solid 1px #dce3e9;
  background-color: #fff;
  padding: 0 20px;
  box-sizing: border-box;
  z-index: 1;
}
.logo {
  line-height: 60px;
  font-size: 20px;
  color: #363d4d;
  img {
    height: 35px;
    width: auto;
    vertical-align: middle;
    margin-right: 5px;
  }
}
.btnwork {
  line-height: 60px;
  span {
    display: inline-block;
  }
  label {
    margin: 0 5px;
  }
  a {
    margin: 0 5px;
  }
  i {
    margin-right: 5px;
  }
}
</style>
