import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/p-login/login'
import ErrorPage from 'components/p-error/error'
import Admin from 'components/p-admin/admin'
import Calculate from 'components/p-calculate/index'
import Search from 'components/p-search/index'
// zone
import Zone from 'components/p-zone/index'

// Domestic 国内小包
import Domestic from 'components/p-domestic/index'
import DomesticNomal from 'components/p-domestic/normal/index'
import DomesticElectric from 'components/p-domestic/electric/index'

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
        // zone
        {
          path: 'zone',
          component: Zone
        },
        // domestic
        {
          path: 'domestic',
          component: Domestic,
          children: [
            { path: '/', component: DomesticNomal },
            { path: 'electric', component: DomesticElectric },
            { path: 'magnetism', component: DomesticElectric },
            { path: 'oversize', component: DomesticElectric }
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
