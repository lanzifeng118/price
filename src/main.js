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

const store = new Vuex.Store({
  state: {
    zone: [
      {
        name: 'us',
        symbol: '$',
        rate: '0.87'
      },
      {
        name: 'uk',
        symbol: '￡'
      },
      {
        name: 'de',
        symbol: '€'
      },
      {
        name: 'au',
        symbol: '$'
      }
    ],
    user: {
      name: '',
      lastlogintime: '',
      avatar: ''
    }
  }
})
let hasLogin = false
router.beforeEach((to, from, next) => {
  let cookie = util.getCookie()
  if (cookie.admin) {
    hasLogin = true
    store.state.user.name = 'admin'
  } else if (cookie.user) {
    hasLogin = true
    store.state.user.name = 'user'
  } else {
    hasLogin = false
  }

  if (to.matched.length === 0) {
    from.name ? next({ name: from.name }) : next('/admin/calculate')
    return
  }
  // console.log(util.getCookie())
  if (to.matched.some(record => record.meta.requiresAuth)) {
    goPage(hasLogin, '/login')
  } else if (to.meta.loginPage) {
    goPage(!hasLogin, '/admin/calculate')
  } else {
    next()
  }

  function goPage(hasLogin, path) {
    if (hasLogin) {
      next()
    } else {
      next({
        path: path,
        query: { redirect: to.fullPath }
      })
    }
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
