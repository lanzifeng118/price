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
    user: ''
  }
})

router.beforeEach((to, from, next) => {
  let cookie = util.getCookie()
  let state = store.state

  if (cookie.admin) {
    state.user = 'admin'
  } else if (cookie.user) {
    state.user = 'user'
  } else {
    state.user = ''
  }

  let matched = to.matched

  if (matched.length === 0) {
    from.name ? next({ name: from.name }) : next('/admin')
    return
  }

  if (matched.some(v => v.meta.requiresManager)) {
    if (state.user !== 'admin') {
      next('/admin')
    } else {
      next()
    }
  } else if (matched.some(v => v.meta.requiresAuth)) {
    if (!state.user) {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else if (to.meta.loginPage) {
    if (state.user) {
      next('/admin')
    } else {
      next()
    }
  } else {
    next()
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
