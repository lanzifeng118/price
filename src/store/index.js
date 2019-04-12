import { turnObj, turnObj2 } from '../libs/util'

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
    name: 'Ebay',
    logistics: ['1', '2', '3']
  },
  {
    type: '2',
    name: 'Amazon',
    logistics: ['1', '4', '5', '2', '3']
  },
  {
    type: '3',
    name: 'Wish',
    logistics: ['1', '6', '7', '2', '3']
  }
]

export const categoryMap = turnObj(category)
export const localMap = turnObj(local)
export const localMapAll = turnObj2(local)
// console.log(localMapAll)

export const logistics = {
  '1': '国内小包',
  '2': '外仓海运',
  '3': '外仓空运',
  '4': 'FBA海运',
  '5': 'FBA空运',
  '6': 'FBW海运',
  '7': 'FBW空运',
}

export default {
  state: {
    user: '',
    userRole: '',
    title: '广州缤恒定价查询系统',
    category,
    categoryMap,
    local,
    localMapAll,
    localMap,
    logistics
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