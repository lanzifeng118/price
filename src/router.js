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
import ProductList from 'components/p-product/list/index'
import ProductDetail from 'components/p-product/detail/index'

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
    redirect: { name: 'admin' }
  },
  {
    path: '/login',
    component: () => import('views/login.vue'),
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
          {
            path: 'input',
            component: CalculateInput,
            name: 'calculateInput'
          },
          { path: 'result', component: CalculateResult }
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
        meta: { level2: true },
        redirect: { name: 'productList' },
        children: [
          { path: 'list', component: ProductList, name: 'productList' },
          { path: 'detail', component: ProductDetail }
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
  }
]
