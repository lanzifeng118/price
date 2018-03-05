import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/p-login/login'
import ErrorPage from 'components/p-error/error'
import Admin from 'components/p-admin/admin'
import Calculate from 'components/p-calculate/index'
import Search from 'components/p-search/index'

import Logistics from 'components/p-logistics/index'
import LogDomestic from 'components/p-logistics/domestic/index'
import LogDomesticEdit from 'components/p-logistics/domestic-edit/index'

// config
import Config from 'components/p-config/config'
import ConfigList from 'components/p-config/list/list'
import ConfigEdit from 'components/p-config/edit/edit'
import ConfigPassword from 'components/p-config/password/password'

Vue.use(Router)

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      redirect: { name: 'admin' }
    },
    {
      path: '/login',
      component: Login,
      meta: { loginPage: true }
    },
    {
      path: '/error',
      component: ErrorPage
    },
    {
      path: '/admin',
      name: 'admin',
      meta: { requiresAuth: true }, // 需要登录
      component: Admin,
      redirect: { name: 'calculate' },
      children: [
        {
          path: 'calculate',
          name: 'calculate',
          component: Calculate
        },
        {
          path: 'search',
          name: 'search',
          component: Search
        },
        // product
        {
          path: 'product',
          component: Config
        },
        // logistics
        {
          path: 'logistics',
          component: Logistics,
          children: [
            { path: '/', component: LogDomestic },
            {
              path: 'edit',
              component: LogDomesticEdit,
              children: [{ path: ':id' }]
            },
            { path: 'password', component: ConfigPassword }
          ]
        },
        // config
        {
          path: 'config',
          component: Config,
          children: [
            // 中文
            { path: '/', component: ConfigList },
            { path: 'edit', component: ConfigEdit },
            { path: 'password', component: ConfigPassword }
          ]
        }
      ]
    }
  ]
})
