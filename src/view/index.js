// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import router from './router'
import index from './index.vue'
import 'src/css/common.css'
import Utils from '../utils'
import api from '../api/interface'
import store from '../store/index'
import 'babel-polyfill'

import { Button } from 'element-ui'
import { Tree } from 'element-ui'
// import 'src/css/_reset.css'
// import Vue from 'vue'
// import VueRouter from 'vue-router'
// import antDesign from 'ant-design-vue'
// import 'ant-design-vue/dist/antd.css'
// import moment from 'moment'

// import 'moment/locale/zh-cn'

const Vue = require('vue')
// const VueRouter = require('vue-router')
// const routerPush = VueRouter.prototype.push
// VueRouter.prototype.push = function push(location) {
//   return routerPush.call(this, location).catch(error=> error)
// }

// Vue.prototype.$moment = moment;//赋值使用
Vue.prototype.$ELEMENT = { size: 'small', zIndex: 3000 };
Vue.use(Button)
Vue.use(Tree)
// Vue.use(moment)
// moment.locale('zh-cn')
Vue.config.productionTip = false
Vue.prototype.$Utils = Utils
Vue.prototype.$api = api

/* eslint-disable no-new */
// Vue.use(VueRouter)
let EventBus = {
  install(Vue, options) {
    Vue.prototype.$Bus = Vue
  }
}
Vue.use(EventBus)

// Vue.use(antDesign)

const idx = new Vue({
  store,
  router: router,
  render: h => h(index)
}).$mount('#idx')
