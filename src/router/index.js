import Vue from 'vue'
import Router from 'vue-router'

import userLogin from '@/components/login'
import routerview from '@/components/common/routerview'
import admin from '@/components/admin'
import adminHome from '@/components/home'


import orgManage from '@/components/sys_setting/org_manage/org_manage'
import orgEdit from '@/components/sys_setting/org_manage/editOrgInfo'
import roleManage from '@/components/sys_setting/role_manage/role_manage'
import roleEdit from '@/components/sys_setting/role_manage/role_Edit'
import userManage from '@/components/sys_setting/user_manage/user_manage'
import editUser from '@/components/sys_setting/user_manage/edit_user'
import menuManage from '@/components/sys_setting/menu_manage/menu_manage'
import menuEdit from '@/components/sys_setting/menu_manage/menu_edit'
import sqlWatch from '@/components/common/HtmlPanel'
import sysLog from '@/components/sys_setting/sys_log'

import merchantManage from '@/components/interface_manage/merchant_manage/merchant_manage'
import merchantEdit from '@/components/interface_manage/merchant_manage/merchant_edit'
import interfaceManage from '@/components/interface_manage/interface_manage/interface_manage'
import interfaceEdit from '@/components/interface_manage/interface_manage/interface_edit'

import dataServiceManage from '@/components/data_service/dataServiceManage'
import serviceCallRecord from '@/components/data_service/serviceCallRecord'
import serviceInvocation from '@/components/data_service/serviceInvocation'
import serviceInformationEdit from '@/components/data_service/serviceInformationEdit'

// 字段管理
import fieldMmanagement from '@/components/fieldMmanagement/fieldMmanagement'
console.log(userLogin)
// import NotFoundComponent from '@/components/common/404'
Vue.use(Router)

const router = new Router({
  // mode: 'history',
  //base:"dsIntegration-manager/",
  routes: [
    {
    path: '/',
    component: userLogin,
    name: 'index',
    meta: {
      title: '数据源登录',
      noRequireAuth: true,
      user: true
    }
  },
  {
    path: '/userLogin',
    component: userLogin,
    name: 'userLogin',
    meta: {
      title: '数据源登录',
      noRequireAuth: true,
      user: true
    }
  }, 
  {
    path: '/admin',
    component: admin,
    name: '第三方数据源平台',
    redirect: '/admin/home',
    children: [
      {
        path: 'home',
        component: adminHome,
        name: '首页',
        redirect: '/admin/settings'
      },
      {
        path: 'fieldMmanagement',
        component: fieldMmanagement,
        name: 'fieldMmanagement'
      },
      {
        path: 'dataServiceManage',
        component: dataServiceManage,
        name: 'dataServiceManage'
      },
      {
        path: 'serviceCallRecord',
        component: serviceCallRecord,
        name: 'serviceCallRecord'
      },
      {
        path: 'serviceInvocation/:id',
        component: serviceInvocation,
        name: 'serviceInvocation'
      },
      {
        path: 'serviceInformationEdit/:id/:categoryId',
        component: serviceInformationEdit,
        name: 'serviceInformationEdit'
      },
      {
        path: 'settings',
        component: routerview,
        name: '案件设置',
        redirect: 'settings/userManage',
        children: [{
            path: 'orgManage',
            component: orgManage,
            name: '组织管理'
          },
          {
            path: 'orgEdit/:id',
            component: orgEdit,
            name: '新增组织'
          },
          {
            path: 'roleManage',
            component: roleManage,
            name: '角色管理'
          },
          {
            path: 'roleEdit/:id',
            component: roleEdit,
            name: '编辑角色'
          },
          {
            path: 'userManage',
            component: userManage,
            name: '用户管理'
          },
          {
            path: 'editUser/:id',
            component: editUser,
            name: '用户管理'
          },
          {
            path: 'menuManage',
            component: menuManage,
            name: '菜单管理'
          },
          {
            path: 'menuEdit/:id',
            component: menuEdit,
            name: '菜单管理'
          },
          {
            path: 'sqlWatch',
            component: sqlWatch,
            name: 'SQL监控'
          },
          {
            path: 'sysLog',
            component: sysLog,
            name: '系统日志'
          }
        ]
      },
      {
        path: 'interface',
        component: routerview,
        name: '接口管理',
        redirect: 'interface/merchantManage',
        children: [{
            path: 'merchantManage',
            component: merchantManage,
            name: '供应商管理'
          },
          {
            path: 'merchantEdit/:id',
            component: merchantEdit,
            name: '供应商管理'
          }
        ]
      },
      {
        path: 'interfaceManage',
        component: interfaceManage,
        name: '接口管理'
      },
      {
        path: 'interfaceEdit/:id',
        component: interfaceEdit,
        name: '接口管理'
      }
    ]
  }
]
})

// 判断是否需要登录权限 以及是否登录
router.beforeEach((to, from, next) => {
  next()
  // if (to.meta.title) {
  //   document.title = to.meta.title;
  // }
  // if (to.meta && to.meta.code === '404') {
  //   next()
  // } else if (to.meta && to.meta.user) { // 用户端
  //   if (localStorage.getItem('userAccessToken')) { //有登录token
  //     if (to.meta && to.meta.noRequireAuth) { // 对于登录页,转登录后首页
  //       next({
  //         path: '/user/home'
  //       })
  //     } else {
  //       next()
  //     }
  //   } else { // 无登录token
  //     if (to.meta && to.meta.noRequireAuth) { // 对于登录页,放行
  //       next()
  //     } else {
  //       next({
  //         path: '/userLogin'
  //       })
  //     }
  //   }
  // } else { // 是管理端
  //   if (localStorage.getItem('adminAccessToken')) { //有登录token
  //     if (to.meta && to.meta.noRequireAuth) { // 对于登录页,转登录后首页
  //       next({
  //         path: '/admin/home'
  //       })
  //     } else {
  //       next()
  //     }
  //   } else { // 无登录token
  //     if (to.meta && to.meta.noRequireAuth) { // 对于登录页,放行
  //       next()
  //     } else {
  //       next({
  //         path: '/arbLogin'
  //       })
  //     }
  //   }
  // }

})



export default router
