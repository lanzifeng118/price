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
// export const logOrder = ['国内小包', '海运小包', '空运小包']
export const logOrder = [
  {
    type: 1,
    name: '国内小包'
  },
  {
    type: 2,
    name: 'FBW海运'
  },
  {
    type: 3,
    name: 'FBW空运'
  },
  {
    type: 4,
    name: '外仓空运'
  },
  {
    type: 5,
    name: '外仓海运'
  }
]

export default {
  state: {
    user: '',
    userRole: '',
    title: '广州缤恒定价查询系统',
    category,
    categoryMap,
    local,
    localMap,
    logOrder,
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