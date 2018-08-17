import axios from 'axios'
import { Message } from 'element-ui'
import { baseURL } from '@/config'
import router from './router'
var myAxios = axios.create({
  baseURL: baseURL,
  
})
// 超时时间
myAxios.defaults.timeout = 30000
// http请求拦截器
var loadinginstace
myAxios.interceptors.request.use(config => {
  let current = router.history.current
  if (current.meta.hasOwnProperty('user') && current.meta.hasOwnProperty('user') === true) {
    // 判断为用户端
    config.headers.Authorization = localStorage.getItem('userAccessToken');
  }
  else {
    // 管理端
    config.headers.Authorization = localStorage.getItem('adminAccessToken');
  }
  return config
}, error => {
  Message.error({
    message: '加载超时'
  })
  return Promise.reject(error)
})
// http响应拦截器
myAxios.interceptors.response.use(res => {
  if (res.data.code === 403) {
    Message.error({
      message: '登录失效，请重新登录'
    })
  } else {
    return res
  }
}, error => {
  try {
    if (error.response.status === 401) {   // token过期      
      Message.error({
        message: '登录失效，请重新登录'
      })     
      router.replace({
        path: '/userLogin'
      })
    } else if (error.response.status === 500) {
      Message.error({
        message: error.response.error
      })
    }
    // let current = router.history.current
    // if (current.meta.hasOwnProperty('user') && current.meta.hasOwnProperty('user') === true) {
    //   // 判断为用户端
    //   localStorage.removeItem('userAccessToken')
    //   localStorage.removeItem('userOutAccessToken')
    //   router.replace({
    //     path: '/userLogin'
    //   })
    // }
    // else {
    //   // 管理端
    //   localStorage.removeItem('adminOutAccessToken')
    //   localStorage.removeItem('adminAccessToken')
    //   sessionStorage.removeItem('breadListStorage')
    //   router.replace({
    //     path: '/arbLogin'
    //   })
    // }

    router.replace({
      path: '/userLogin'
    })
  } catch (e) {
    console.log('token过期', e)
  }
  return Promise.reject(error)
})

const api = {
  getCodeUrl() {  // 验证码url
    return baseURL + '/api/captcha.jpg'
  },
  userLogin(params) {  // 登录
    return myAxios({
      method: 'post',
      url: '/api/sys/login',
      params: params
    })
  },
  userInfo() {  // 登录用户信息
    return myAxios({
      method: 'get',
      url: '/api/sys/user/info'
    })
  },
  menuList(params) {  // 主页菜单
    return myAxios({
      method: 'get',
      url: '/api/sys/menu/user',
      params: params
    })
  },


  //--------------组织管理----------------->>>>>>>>>>

  getOrgList(params) {  // 获取组织列表
    return myAxios({
      method: 'get',
      url: '/api/sys/organization/select',
      params: params
    })
  },
  getOrgListForSelect(params) {  // 获取下拉框的组织列表
    return myAxios({
      method: 'get',
      url: '/api/sys/organization/query/organizationInfo',
      params: params
    })
  },
  saveOrgInfo(params) {  // 新增组织
    return myAxios({
      method: 'post',
      url: '/api/sys/organization/save',
      params: params
    })
  },
  updateOrgInfo(params) {  //更新信息组织
    return myAxios({
      method: 'post',
      url: '/api/sys/organization/update',
      params: params
    })
  },
  updateOrgState(params) {  // 更新组织状态
    return myAxios({
      method: 'post',
      url: '/api/sys/organization/updateState',
      params: params
    })
  },
  deleteOrg(params) {  // 删除组织
    return myAxios({
      method: 'post',
      url: '/api/sys/organization/delete',
      params: params
    })
  },
  getOrgInfoById(params) {  // 获取组织详情
    return myAxios({
      method: 'get',
      url: '/api/sys/organization/selectByPrimaryKey',
      params: params
    })
  },
  //-----------------组织管理-------------<<<<<<<<<<<<

  //----------------角色管理----------------->>>>>>>>>>>>
  getRoleList(params) {  // 获取角色列表
    return myAxios({
      method: 'get',
      url: '/api/sys/role/select',
      params: params
    })
  },
  saveRoleInfo(params) {  // 新增角色
    return myAxios({
      method: 'post',
      url: '/api/sys/role/save',
      params: params
    })
  },
  updateRoleInfo(params) {  //更新信息角色
    return myAxios({
      method: 'post',
      url: '/api/sys/role/update',
      params: params
    })
  },
  deleteRole(params) {  // 删除角色
    return myAxios({
      method: 'post',
      url: '/api/sys/role/delete',
      params: params
    })
  },
  updateRoleState(params) {  // 更新角色状态
    return myAxios({
      method: 'post',
      url: '/api/sys/role/updateState',
      params: params
    })
  },
  getRoleInfoById(params) {  // 获取角色详情
    return myAxios({
      method: 'get',
      url: '/api/sys/role/selectEntityByRoleId',
      params: params
    })
  },
  //-------------角色管理----------<<<<<<<<<<<

  //-------------用户管理----------->>>>>>>>>>>
  getUserList(params) {  // 获取用户列表
    return myAxios({
      method: 'get',
      url: '/api/sys/user/select',
      params: params
    })
  },
  saveUserInfo(params) {  // 新增用户
    return myAxios({
      method: 'post',
      url: '/api/sys/user/save',
      params: params
    })
  },
  updateUserInfo(params) {  //更新信息用户
    return myAxios({
      method: 'post',
      url: '/api/sys/user/update',
      params: params
    })
  },

  deleteUser(params) {  // 删除用户
    return myAxios({
      method: 'post',
      url: '/api/sys/user/delete',
      params: params
    })
  },
  updateUserState(params) {  // 更新用户状态
    return myAxios({
      method: 'post',
      url: '/api/sys/user/updateState',
      params: params
    })
  },
  getUserInfoById(params) {  // 获取用户详情
    return myAxios({
      method: 'get',
      url: '/api/sys/user/selectEntityByUserId',
      params: params
    })
  },
  getRoleListByOrgId(params) {  // 根据组织id获取角色
    return myAxios({
      method: 'get',
      url: '/api/sys/role/query/roleInfo',
      params: params
    })
  },
  //-------------------用户管理----------<<<<<<<<<<<<<<<<


  //----------------菜单管理--------->>>>>>>>>>>>>>>>
  getMenuList(params) {  // 主页菜单
    return myAxios({
      method: 'get',
      url: '/api/sys/menu/perms',
      params: params
    })
  },
  getMenuInfoByMenuId(params) { //根据角色获取菜单
    return myAxios({
      method: 'get',
      url: '/api/sys/menu/info/menuId',
      params: params
    })
  },
  getMenuListByRoleId(params) { //根据角色获取菜单列表
    return myAxios({
      method: 'get',
      url: '/api/sys/menu/info/roleId',
      params: params
    })
  },
  saveMenuInfo(params) {  // 新增菜单
    return myAxios({
      method: 'post',
      url: '/api/sys/menu/save',
      data: params
    })
  },
  deleteMenu(params) {  // 删除菜单
    return myAxios({
      method: 'post',
      url: '/api/sys/menu/delete',
      params: params
    })
  },
  updateMenuState(params) {  // 更新菜单状态
    return myAxios({
      method: 'post',
      url: '/api/sys/menu/updateState',
      params: params
    })
  },
  updateMenuInfo(params) {  //更新菜单信息
    return myAxios({
      method: 'post',
      url: '/api/sys/menu/update',
      data: params
    })
  },

  //-----------------接口管理--------------->>>>>
  getMerchantList(params) {  // 获取供应商列表
    return myAxios({
      method: 'get',
      url: '/api/biz/merchant/select',
      params: params
    })
  },

  updateMerchantInfo(params) {  //更新供应商信息
    return myAxios({
      method: 'post',
      url: '/api/biz/merchant/update',
      params: params
    })
  },

  getMerchantInfoByMerchantId(params) { //获取供应商详情
    return myAxios({
      method: 'get',
      url: '/api/biz/merchant/selectByPrimaryKey',
      params: params
    })
  },

  getcategoryList(params) {  // 获取类型列表
    return myAxios({
      method: 'get',
      url: '/api/biz/category/select',
      params: params
    })
  },
  getInterfaceList(params) {  // 获取接口列表
    return myAxios({
      method: 'get',
      url: '/api/biz/interface/selectIntefaceList',
      params: params
    })
  },

  getInterfaceDetail(params) {  // 获取接口详情
    return myAxios({
      method: 'get',
      url: '/api/biz/interface/selectByPrimaryKey',
      params: params
    })
  },

  moveInterface(params) {  // 移动接口
    return myAxios({
      method: 'post',
      url: '/api/biz/interface/move',
      params: params
    })
  },

  //-----------------接口管理-------------------<<<<<<<<<<<<

  //------------------系统日志------------------->>>>>>>>>>>>>>>>
  getSysLogList(params) {  // 日志列表
    return myAxios({
      method: 'get',
      url: '/api/sys/log/select',
      params: params
    })
  },
  //-----------------系统日志------------<<<<<<<<<<<<<<<

  //  -----------------系统字段管理-------------------<<<<<<<<<<<<
  getFieldList (params) { // 加载所有字段信息
    return myAxios({
      method: 'get',
      url: '/api/biz/field/select',
      params: params
    })
  },
  getQueryRequestFields (params) { // 根据响应字段查询输入字段
    return myAxios({
      method: 'get',
      url: '/api/biz/field/queryRequestFields',
      params: params
    })
  },
  moveFields (params) { // 移动字段信息
    return myAxios({
      method: 'post',
      url: '/api/biz/field/move',
      params: params
    })
  },
  updateFields (params) { // 更改字段信息
    return myAxios({
      method: 'post',
      url: '/api/biz/field/updateState',
      params: params
    })
  },

  // 系统类型管理
  getSelectTypeList (params) { // 加载所选类型信息
    return myAxios({
      method: 'get',
      url: '/api/biz/category/select',
      params: params
    })
  },
  addSelectTypeList (params) { // 增
    return myAxios({
      method: 'post',
      url: '/api/biz/category/save',
      params: params
    })
  },
  deleteSelectTypeList (params) { // 删
    return myAxios({
      method: 'post',
      url: '/api/biz/category/delete',
      params: params
    })
  },
  moveSelectTypeList (params) { // 移动
    return myAxios({
      method: 'post',
      url: '/api/biz/category/move',
      params: params
    })
  },
  updateSelectTypeList (params) { // 移动
    return myAxios({
      method: 'post',
      url: '/api/biz/category/updateName',
      params: params
    })
  },
  // end
  // 数据基础服务
  getDataServiceList (params) {  // 加载数据服务列表
    return myAxios({
      method: 'get',
      url: '/api/biz/service/list',
      params: params
    })
  },
  selectByServiceId (params) {  // 根据服务id查询服务信息
    return myAxios({
      method: 'get',
      url: '/api/biz/service/selectByServiceId',
      params: params
    })
  },
  updateDataServiceState (params) {  // 修改服务状态
    return myAxios({
      method: 'post',
      url: '/api/biz/service/updateState',
      params: params
    })
  },
  testDataServiceState (params) {  // 测试服务状态
    return myAxios({
      method: 'get',
      url: '/api/biz/service/testService',
      params: params
    })
  },
  updateDataServiceList (params) {  // 修改服务
    return myAxios({
      method: 'post',
      url: '/api/biz/service/update',
      data: params
    })
  },
  addDataServiceList (params) {  // 添加服务
    return myAxios({
      method: 'post',
      url: '/api/biz/service/save',
      data: params
    })
  },
  deleteDataServiceList (params) {  // 删除服务
    return myAxios({
      method: 'post',
      url: '/api/biz/service/delete',
      params: params
    })
  },
  moveDataServiceList (params) {  // 移动服务
    return myAxios({
      method: 'post',
      url: '/api/biz/service/move',
      params: params
    })
  },
  getDataServiceUrl (params) {  // 获取服务接口地址
    return myAxios({
      method: 'get',
      url: '/api/biz/service/getUrl',
      params: params
    })
  },
  // 服务日志调用
  getServiceRedord (params) {
    return myAxios({
      method: 'get',
      url: '/api/biz/serviceRecord/list',
      params: params
    })
  },
  getServiceRedordById (params) {
    return myAxios({
      method: 'get',
      url: '/api/biz/serviceRecord/selectById',
      params: params
    })
  }
}
export { api }
