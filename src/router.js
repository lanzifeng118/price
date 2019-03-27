// zone
import Zone from 'components/p-zone/index'

// factor
import Factor from 'components/p-factor/index'

// lowest
import Lowest from 'components/p-lowest/index'
import LowestEbay10 from 'components/p-lowest/ebay-10/index'
import LowestEbay15 from 'components/p-lowest/ebay-15/index'
import LowestAmazon10 from 'components/p-lowest/amazon-10/index'
import LowestAmazon15 from 'components/p-lowest/amazon-15/index'

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
import ConfigList from 'components/p-config/list/index'
import ConfigPassword from 'components/p-config/password/index'

export default [
  {
    path: '/',
    meta: { hasLogin: true }, // 需要登录
    component: () => import('views/admin.vue'),
    redirect: { name: 'calculate' },
    children: [
      {
        path: 'calculate',
        name: 'calculate',
        meta: { level1: true },
        component: () => import('views/calculate/index.vue'),
        children: [
          {
            path: '/',
            component: () => import('views/calculate/input.vue')
          },
          {
            path: 'result',
            component: () => import('views/calculate/result.vue')
          }
        ]
      },
      {
        path: 'search',
        name: 'search',
        meta: { level1: true },
        component: () => import('views/search.vue')
      },
      // product
      {
        path: 'product',
        component: () => import('views/product/index.vue'),
        meta: { level2: true },
        children: [
          {
            path: '/',
            component: () => import('views/product/list.vue'),
          },
          { 
            path: 'detail', 
            component: () => import('views/product/detail.vue') 
          }
        ]
      },
      // product
      {
        path: 'lowest',
        component: Lowest,
        meta: { level1: true },
        redirect: { name: 'LowestEbay10' },
        children: [
          { path: '/', component: LowestEbay10, name: 'LowestEbay10' },
          { path: 'ebay-15', component: LowestEbay15 },
          { path: 'amazon-10', component: LowestAmazon10 },
          { path: 'amazon-15', component: LowestAmazon15 }
        ]
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
          { path: '/', component: ConfigList },
          { path: 'password', component: ConfigPassword }
        ]
      }
    ]
  },
  {
    path: '/login',
    component: () => import('views/login.vue'),
    meta: { loginPage: true }
  },
  {
    path: '/error',
    component: () => import('views/error.vue')
  }
]
