import Vue from 'vue'
import Router from 'vue-router'
import Login from 'components/p-login/login'
import ErrorPage from 'components/p-error/error'
import Admin from 'components/p-admin/admin'

import Calculate from 'components/p-calculate/index'
import CalculateInput from 'components/p-calculate/input/index'
import CalculateResult from 'components/p-calculate/result/index'

import Search from 'components/p-search/index'
// zone
import Zone from 'components/p-zone/index'

// factor
import Factor from 'components/p-factor/index'

// product
import Product from 'components/p-product/index'

// Domestic 国内小包
import Domestic from 'components/p-domestic/index'
import DomesticNomal from 'components/p-domestic/normal/index'
import DomesticElectric from 'components/p-domestic/electric/index'
import DomesticMagnetism from 'components/p-domestic/magnetism/index'
import DomesticOversize from 'components/p-domestic/oversize/index'

// local 当地配送
import Local from 'components/p-local/index'
import LocalEbay from 'components/p-local/ebay/index'
import LocalAmazon from 'components/p-local/amazon/index'

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
      meta: { hasLogin: true }, // 需要登录
      component: Admin,
      redirect: { name: 'calculate' },
      children: [
        {
          path: 'calculate',
          name: 'calculate',
          meta: { level1: true },
          component: Calculate,
          redirect: { name: 'calculateInput' },
          children: [
            { path: 'input', component: CalculateInput, name: 'calculateInput' },
            {
              path: 'result',
              component: CalculateResult
            }
          ]
        },
        {
          path: 'search',
          name: 'search',
          meta: { level1: true },
          component: Search
        },
        // product
        {
          path: 'product',
          component: Product,
          meta: { level2: true }
        },
        // zone
        {
          path: 'zone',
          component: Zone,
          meta: { level3: true }
        },
        // factor
        {
          path: 'factor',
          component: Factor,
          meta: { level4: true }
        },
        // domestic
        {
          path: 'domestic',
          component: Domestic,
          meta: { level4: true },
          children: [
            { path: '/', component: DomesticNomal },
            { path: 'electric', component: DomesticElectric },
            { path: 'magnetism', component: DomesticMagnetism },
            { path: 'oversize', component: DomesticOversize }
          ]
        },
        // local
        {
          path: 'local',
          component: Local,
          meta: { level4: true },
          children: [
            { path: '/', component: LocalEbay },
            { path: 'amazon', component: LocalAmazon }
          ]
        },
        // config
        {
          path: 'config',
          component: Config,
          meta: { level5: true },
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
