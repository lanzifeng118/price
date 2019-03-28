import { turnObj } from '../libs/util'

const category = [
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
    name: '超U尺寸'
  }
]

const local = [
  {
    type: '1',
    name: 'Ebay'
  },
  {
    type: '2',
    name: 'Amazon'
  },
  {
    type: '3',
    name: 'Wish'
  }
]

export const categoryMap = turnObj(category)
export const localMap = turnObj(local)

export default {
  state: {
    user: '',
    userRole: '',
    title: '广州缤恒定价查询系统',
    category,
    categoryMap,
    local,
    localMap,
    logOrder: ['国内小包', '海运小包', '空运小包']
  },
  mutations: {
    setUser(state, user) {
      state.user = user
    },
    setUserRole(state, userRole) {
      state.userRole = userRole
    }
  }
}