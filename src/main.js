
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
//import JSEncrypt from '@/util/jsencrypt'
//import VueQuillEditor from 'vue-quill-editor'

import VueClipboard from 'vue-clipboard2'
import Components from './components/common/install'
Vue.use(Components)
Vue.use(VueClipboard)


import 'element-ui/lib/theme-chalk/index.css'
import 'font-awesome/css/font-awesome.css'
import 'animate.css'

import './scss/public.scss'
import './assets/newcss/common.css'
Vue.use(ElementUI)
//Vue.use(VueQuillEditor)
Vue.config.productionTip = false
//Vue.prototype.$JSEncrypt = new JSEncrypt()
//Vue.prototype.PublicKey ='MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCPfoCRJo068xVcIhYnigpb4sxMjSKlkXVZIgl0vTdkdda+Qu8n4VxiLv6P8mHPi9WLZENJQd4kSM6gvSMpm2PtkNRY7aLceTrroPd6tAjKxsa8hvClAFy97OEcpOzi+WqxL8ERSeZ62Rai3fVjIbMP4b1tXaPiUxoPGgdJ74/l/QIDAQAB'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
