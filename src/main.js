// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuex from 'vuex'
import util from 'components/tools/util'

Vue.use(VueAxios, axios)
Vue.use(Vuex)

Vue.config.productionTip = false

let category = [
  {
    type: '1',
    name: '普通'
  },
  {
    type: '2',
    name: '带电'
  },
  {
    type: '3',
    name: '带磁'
  },
  {
    type: '4',
    name: '超尺寸'
  }
]
let local = [
  {
    type: '1',
    name: 'Ebay'
  },
  {
    type: '2',
    name: 'Amazon'
  }
]
let categoryMap = turnObj(category)
let localMap = turnObj(local)

const store = new Vuex.Store({
  state: {
    user: '',
    category,
    categoryMap,
    local,
    localMap
  }
})

/**
 * admin 管理员 全部
 * xs001 主管   计算、查询、商品信息、地区信息（仅查看）
 * xs002 专员   计算、查询（隐藏采购成本）
 * w1001 物流   地区信息、公式系数、国内小包、当地配送
 * level1 计算、查询
 * level2 商品信息
 * level3 地区信息
 * level4 公式系数、国内小包、当地配送
 * level5 系统配置
 */

router.beforeEach((to, from, next) => {
  let cookie = util.getCookie()
  let state = store.state

  if (cookie.admin) {
    state.user = 'admin'
  } else if (cookie.xs001) {
    state.user = 'xs001'
  } else if (cookie.xs002) {
    state.user = 'xs002'
  } else if (cookie.w1001) {
    state.user = 'w1001'
  } else {
    state.user = ''
  }

  // state.user = 'w1001'

  let matched = to.matched

  if (matched.length === 0) {
    from.name ? next({ name: from.name }) : next('/admin')
    return
  }
  if (matched.some(v => v.meta.hasLogin)) {
    if (!state.user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      afterLogin()
    }
  } else if (to.meta.loginPage) {
    if (state.user) {
      goNext()
    } else {
      next()
    }
  } else {
    next()
  }

  function afterLogin() {
    if (matched.some(v => v.meta.level5)) {
      if (state.user === 'admin') {
        next()
      } else {
        goNext()
      }
    } else if (matched.some(v => v.meta.level4)) {
      if (state.user === 'admin' || state.user === 'w1001') {
        next()
      } else {
        goNext()
      }
    } else if (matched.some(v => v.meta.level3)) {
      if (state.user === 'admin' || state.user === 'w1001' || state.user === 'xs001') {
        next()
      } else {
        goNext()
      }
    } else if (matched.some(v => v.meta.level2)) {
      if (state.user === 'admin' || state.user === 'xs001') {
        next()
      } else {
        goNext()
      }
    } else if (matched.some(v => v.meta.level1)) {
      if (state.user === 'admin' || state.user === 'xs001' || state.user === 'xs002') {
        next()
      } else {
        goNext()
      }
    }
  }

  function goNext(params) {
    state.user === 'w1001' ? next('/admin/zone') : next('/admin')
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

function turnObj(arr) {
  let map = {}
  arr.forEach(v => {
    map[v.type] = v.name
  })
  return map
}
