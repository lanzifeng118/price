import { post } from '../libs/post'

const URL = '/goods'
export const API_product = {
  query: post(URL, 'query'),
  queryBySku: post(URL, 'queryBySku'),
  queryForCalculate: post(URL, 'queryForCalculate'),
  insert: post(URL, 'insert'),
  update: post(URL, 'update'),
  updateBySku: post(URL, 'updateBySku'),
  delete: post(URL, 'delete')
}
