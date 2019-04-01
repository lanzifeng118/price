// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import routes from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import Router from 'vue-router'
import storeData from './store'
import registryToast from 'components/toast'
import Pop from 'components/pop'
import { getCookie } from './libs/util'

Vue.use(Router)
Vue.use(VueAxios, axios)
Vue.use(Vuex)
Vue.use(registryToast)
Vue.use(Pop)


const router = new Router({
  linkActiveClass: 'active',
  routes
})

Vue.config.productionTip = false

const store = new Vuex.Store(storeData)

/**
 * admin 管理员 全部
 * xs001 主管   计算、查询、商品信息、地区信息（仅查看）
 * xs002 专员   计算、查询（隐藏采购成本）
 * wl001 物流   地区信息、公式系数、国内小包、当地配送
 * level1 计算、查询
 * level2 商品信息
 * level3 地区信息
 * level4 公式系数、国内小包、当地配送
 * level5 系统配置
 */

router.beforeEach((to, from, next) => {
  const { account: user, role } = getCookie()

  store.commit('setUser', user)
  store.commit('setUserRole', role)

  const { matched } = to

  if (matched.length === 0) {
    from.name ? next({ name: from.name }) : next('/')
    return
  }
  if (matched.some(v => v.meta.hasLogin)) {
    if (!user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      afterLogin()
    }
  } else if (to.meta.loginPage) {
    if (user) {
      goNext()
    } else {
      next()
    }
  } else {
    next()
  }

  function afterLogin() {
    if (matched.some(v => v.meta.level5)) {
      if (user === 'admin') {
        next()
      } else {
        goNext()
      }
    } else if (matched.some(v => v.meta.level4)) {
      if (user === 'admin' || user === 'wl001') {
        next()
      } else {
        goNext()
      }
    } else if (matched.some(v => v.meta.level3)) {
      if (user === 'admin' || user === 'wl001' || user === 'xs001') {
        next()
      } else {
        goNext()
      }
    } else if (matched.some(v => v.meta.level2)) {
      if (user === 'admin' || user === 'xs001') {
        next()
      } else {
        goNext()
      }
    } else if (matched.some(v => v.meta.level1)) {
      if (user === 'admin' || user === 'xs001' || user === 'xs002') {
        next()
      } else {
        goNext()
      }
    }
  }

  function goNext() {
    user === 'wl001' ? next('/zone') : next('/')
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  store,
  components: {
    App
  }
})