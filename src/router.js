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
        redirect: { name: 'calculateInput' },
        component: () => import('views/calculate/index.vue'),
        children: [
          {
            path: '',
            name: 'calculateInput',
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
            component: () => import('views/product/list.vue')
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
        component: () => import('views/lowest/index.vue'),
        meta: { level1: true },
        children: [
          {
            path: '',
            component: () => import('views/lowest/ebay-10.vue')
          },
          {
            path: 'ebay-15',
            component: () => import('views/lowest/ebay-15.vue')
          },
          {
            path: 'amazon-10',
            component: () => import('views/lowest/amazon-10.vue')
          },
          {
            path: 'amazon-15',
            component: () => import('views/lowest/amazon-15.vue')
          }
        ]
      },
      // zone
      {
        path: 'zone',
        component: () => import('views/zone.vue'),
        meta: { level3: true }
      },
      // factor
      {
        path: 'factor',
        component: () => import('views/factor.vue'),
        meta: { level4: true }
      },
      // domestic
      {
        path: 'domestic/:local',
        component: () => import('views/domestic/index.vue'),
        meta: { level4: true },
        children: [
          {
            path: '',
            component: () => import('views/domestic/normal.vue')
          },
          {
            path: 'electric',
            component: () => import('views/domestic/electric.vue')
          },
          {
            path: 'magnetism',
            component: () => import('views/domestic/magnetism.vue')
          },
          {
            path: 'oversize',
            component: () => import('views/domestic/oversize.vue')
          }
        ]
      },
      // local
      {
        path: 'local',
        component: () => import('views/local/index.vue'),
        meta: { level4: true },
        children: [
          { path: '', component: () => import('views/local/ebay.vue') },
          { path: 'amazon', component: () => import('views/local/amazon.vue') },
          { path: 'wish', component: () => import('views/local/wish.vue') },
          { path: 'amazonOut', component: () => import('views/local/amazonOut.vue') },
          { path: 'wishOut', component: () => import('views/local/wishOut.vue') }
        ]
      },
      // config
      {
        path: 'config',
        component: () => import('views/config/index.vue'),
        meta: { level5: true },
        children: [
          {
            path: '',
            component: () => import('views/config/list.vue')
          },
          {
            path: 'password',
            component: () => import('views/config/password.vue')
          }
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
